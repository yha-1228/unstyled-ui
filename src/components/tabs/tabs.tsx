import React, { useId, useRef } from 'react';
import { useControlableState } from '../../hooks/use-controlable-state';
import { useNode } from '../../hooks/use-node';
import { createContext } from '../../utils/react';

// Utils
// --------------------

const generateTabId = (index: number, id: string) => `tab-${index}-${id}`;

const generatePanelId = (index: number, id: string) => `panel-${index}-${id}`;

const getFocusKeys = (
  orientation: React.AriaAttributes['aria-orientation']
) => {
  switch (orientation) {
    case 'horizontal':
      return { prev: 'ArrowLeft', next: 'ArrowRight' };

    case 'vertical':
      return { prev: 'ArrowUp', next: 'ArrowDown' };

    default:
      throw new Error('Undefined value');
  }
};

// TabsRoot
// --------------------

type TabsProviderProps = {
  /**
   * @default 0
   */
  defaultIndex?: number;
  /**
   * If control
   */
  activeIndex?: number;
  /**
   * @default "horizontal"
   */
  orientation?: React.AriaAttributes['aria-orientation'];
  /**
   * @default "automatic"
   */
  tabChangeMode?: 'automatic' | 'manual';
  onTabChange?: (selectedIndex: number) => void;
};

type TabsState = {
  id: string;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
};

type TabsContextValue = TabsState & Omit<TabsProviderProps, 'defaultIndex'>;

const [TabsContext, useTabsContext] = createContext<TabsContextValue>({
  hookName: 'useTabsContext',
  providerName: 'Tabs.Root',
});

type DivProps = React.ComponentPropsWithRef<'div'>;

const TabsRoot = React.forwardRef<HTMLDivElement, DivProps & TabsProviderProps>(
  (props, ref) => {
    const {
      defaultIndex = 0,
      activeIndex: activeIndexProp,
      orientation = 'horizontal',
      tabChangeMode = 'automatic',
      onTabChange,
      ...divProps
    } = props;
    const id = useId();
    const [activeIndex, setActiveIndex] = useControlableState(
      defaultIndex,
      activeIndexProp
    );

    return (
      <TabsContext.Provider
        value={{
          id,
          activeIndex,
          setActiveIndex,
          orientation,
          tabChangeMode,
          onTabChange,
        }}
      >
        <div {...divProps} ref={ref} />
      </TabsContext.Provider>
    );
  }
);

TabsRoot.displayName = 'TabsRoot';

// TabList
// --------------------

type TabListProps = Omit<React.ComponentPropsWithRef<'div'>, 'children'> & {
  children: React.ReactElement[] | React.ReactElement;
};

type TabContextValue = {
  index: number;
  lastIndex: number;
  firstTabElement: HTMLButtonElement;
  lastTabElement: HTMLButtonElement;
};

const [TabContext, useTabContext] = createContext<TabContextValue>({
  hookName: 'useTabContext',
  providerName: 'Tabs.TabList',
});

function TabList(props: TabListProps) {
  const { children, ...restTabListProps } = props;
  const { orientation } = useTabsContext();
  const lastTabElementIndex = React.Children.count(children) - 1;
  const [ref, tabElement] = useNode<HTMLDivElement>();
  const firstTabElement = tabElement?.firstElementChild;
  const lastTabElement = tabElement?.lastElementChild;

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      {...restTabListProps}
      ref={ref}
    >
      {React.Children.map(children, (children, index) => {
        return (
          <TabContext.Provider
            key={index}
            value={{
              index,
              lastIndex: lastTabElementIndex,
              firstTabElement: firstTabElement as HTMLButtonElement,
              lastTabElement: lastTabElement as HTMLButtonElement,
            }}
          >
            {children}
          </TabContext.Provider>
        );
      })}
    </div>
  );
}

TabList.displayName = 'TabList';

// Tab
// --------------------

type TabProps = React.ComponentPropsWithRef<'button'>;

function Tab(props: TabProps) {
  const {
    activeIndex,
    setActiveIndex,
    onTabChange,
    id,
    orientation,
    tabChangeMode,
  } = useTabsContext();
  const focusKeys = getFocusKeys(orientation);
  const { index, lastIndex, firstTabElement, lastTabElement } = useTabContext();
  const selected = index === activeIndex;
  const ref = useRef<HTMLButtonElement>(null);

  const actionTabChange = (selectedIndex: number) => {
    if (selectedIndex !== activeIndex) {
      setActiveIndex(selectedIndex);
      onTabChange?.(selectedIndex);
    }
  };

  const handleClick = () => {
    actionTabChange(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === focusKeys.next) {
      const nextTabElement = ref.current?.nextElementSibling;

      if (nextTabElement instanceof HTMLButtonElement) {
        tabChangeMode === 'automatic' && actionTabChange(index + 1);
        nextTabElement.focus();
      } else {
        tabChangeMode === 'automatic' && actionTabChange(0);
        firstTabElement.focus();
      }
    }

    if (e.key === focusKeys.prev) {
      const prevTabElement = ref.current?.previousElementSibling;

      if (prevTabElement instanceof HTMLButtonElement) {
        tabChangeMode === 'automatic' && actionTabChange(index - 1);
        prevTabElement.focus();
      } else {
        tabChangeMode === 'automatic' && actionTabChange(lastIndex);
        lastTabElement.focus();
      }
    }

    if (e.key === 'Home') {
      tabChangeMode === 'automatic' && actionTabChange(0);
      firstTabElement.focus();
    }

    if (e.key === 'End') {
      tabChangeMode === 'automatic' && actionTabChange(lastIndex);
      lastTabElement.focus();
    }

    if (e.key === 'Enter') {
      actionTabChange(index);
    }
  };

  return (
    <button
      ref={ref}
      tabIndex={selected ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-selected={selected}
      aria-controls={generatePanelId(index, id)}
      id={generateTabId(index, id)}
      data-state={selected ? 'active' : 'inactive'}
      type="button"
      role="tab"
      {...props}
    />
  );
}

// PanelList
// --------------------

type PanelListProps = {
  children: React.ReactElement[] | React.ReactElement;
};

type PanelContextValue = {
  index: number;
};

const [PanelContext, usePanelContext] = createContext<PanelContextValue>({
  hookName: 'usePanelContext',
  providerName: 'Tabs.PanelList',
});

function PanelList(props: PanelListProps) {
  const { children } = props;

  return (
    <>
      {React.Children.map(children, (children, index) => (
        <PanelContext.Provider key={index} value={{ index }}>
          {children}
        </PanelContext.Provider>
      ))}
    </>
  );
}

PanelList.displayName = 'PanelList';

// Panel
// --------------------

type PanelProps = React.ComponentPropsWithRef<'div'>;

type PanelRef = HTMLDivElement;

const Panel = React.forwardRef<PanelRef, PanelProps>((props, ref) => {
  const { children, ...restDivProps } = props;
  const { id, activeIndex } = useTabsContext();
  const { index } = usePanelContext();
  const selected = index === activeIndex;

  return (
    <div
      ref={ref}
      role="tabpanel"
      aria-labelledby={generateTabId(index, id)}
      id={generatePanelId(index, id)}
      {...restDivProps}
    >
      {selected && children}
    </div>
  );
});

Panel.displayName = 'Panel';

// export
// --------------------

export const Tabs = {
  Root: TabsRoot,
  TabList,
  Tab,
  PanelList,
  Panel,
};

import React, { useId, useRef, useState } from 'react';
import { useCallbackRef } from '../../hooks/use-callback-ref';
import { createContext } from '../../utils/react';

// Utils
// --------------------

const generateTabId = (index: number, id: string) => `tab-${index}-${id}`;

const generatePanelId = (index: number, id: string) => `panel-${index}-${id}`;

// TabsRoot
// --------------------

type TabsProviderProps = {
  defaultIndex?: number;
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

type DivProps = React.ComponentPropsWithoutRef<'div'>;

function TabsRoot(props: DivProps & TabsProviderProps) {
  const { defaultIndex = 0, onTabChange, ...divProps } = props;

  const id = useId();

  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const tabsContextValue: TabsContextValue = {
    id,
    activeIndex,
    setActiveIndex,
    onTabChange,
  };

  return (
    <TabsContext.Provider value={tabsContextValue}>
      <div {...divProps} />
    </TabsContext.Provider>
  );
}

// TabList
// --------------------

type TabListProps = Omit<React.ComponentPropsWithRef<'div'>, 'children'> & {
  children: React.ReactElement[] | React.ReactElement;
};

type TabContextValue = {
  index: number;
  lastIndex: number;
  firstElement: HTMLButtonElement;
  lastElement: HTMLButtonElement;
};

const [TabContext, useTabContext] = createContext<TabContextValue>({
  hookName: 'useTabContext',
  providerName: 'Tabs.TabList',
});

const TabList: React.FC<TabListProps> = (props) => {
  const { children, ...propsExcludeChildren } = props;
  const lastTabElementIndex = React.Children.count(children) - 1;

  const [ref, tabElement] = useCallbackRef<HTMLDivElement>();

  const firstTabElement = tabElement?.firstElementChild;
  const lastTabElement = tabElement?.lastElementChild;

  return (
    <div role="tablist" {...propsExcludeChildren} ref={ref}>
      {React.Children.map(children, (children, index) => {
        return (
          <TabContext.Provider
            key={index}
            value={{
              index,
              lastIndex: lastTabElementIndex,
              firstElement: firstTabElement as HTMLButtonElement,
              lastElement: lastTabElement as HTMLButtonElement,
            }}
          >
            {children}
          </TabContext.Provider>
        );
      })}
    </div>
  );
};

TabList.displayName = 'TabList';

// Tab
// --------------------

type TabProps = React.ComponentPropsWithRef<'button'>;

const Tab: React.FC<TabProps> = (props) => {
  const { activeIndex, setActiveIndex, onTabChange, id } = useTabsContext();

  const { index, lastIndex, firstElement, lastElement } = useTabContext();

  const ref = useRef<HTMLButtonElement>(null);

  const selected = index === activeIndex;

  const actionTabChange = (selectedIndex: number) => {
    setActiveIndex(selectedIndex);
    onTabChange?.(selectedIndex);
  };

  const handleClick = () => {
    ref.current?.focus();
    actionTabChange(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowRight') {
      const nextTabElement = ref.current?.nextElementSibling;

      if (nextTabElement instanceof HTMLButtonElement) {
        nextTabElement.focus();
        actionTabChange(index + 1);
      } else {
        firstElement.focus();
        actionTabChange(0);
      }
    }

    if (e.key === 'ArrowLeft') {
      const prevTabElement = ref.current?.previousElementSibling;

      if (prevTabElement instanceof HTMLButtonElement) {
        prevTabElement.focus();
        actionTabChange(index - 1);
      } else {
        lastElement.focus();
        actionTabChange(lastIndex);
      }
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
};

Tab.displayName = 'Tab';

// PanelList
// --------------------

type PanelListProps = React.ComponentPropsWithRef<'div'> & {
  children: React.ReactElement[] | React.ReactElement;
};

type PanelListRef = HTMLDivElement;

type PanelContextValue = {
  index: number;
};

const [PanelContext, usePanelContext] = createContext<PanelContextValue>({
  hookName: 'usePanelContext',
  providerName: 'Tabs.PanelList',
});

const PanelList = React.forwardRef<PanelListRef, PanelListProps>(
  (props, ref) => {
    const { children, ...propsExcludeChildren } = props;

    const { activeIndex } = useTabsContext();

    return (
      <div {...propsExcludeChildren} ref={ref}>
        {React.Children.map(children, (children, index) => {
          const selected = index === activeIndex;

          if (!selected) return null;

          return (
            <PanelContext.Provider key={index} value={{ index }}>
              {children}
            </PanelContext.Provider>
          );
        })}
      </div>
    );
  }
);

PanelList.displayName = 'PanelList';

// Panel
// --------------------

type PanelProps = React.ComponentPropsWithRef<'div'>;

type PanelRef = HTMLDivElement;

const Panel = React.forwardRef<PanelRef, PanelProps>((props, ref) => {
  const { id } = useTabsContext();

  const { index } = usePanelContext();

  return (
    <div
      ref={ref}
      role="tabpanel"
      aria-labelledby={generateTabId(index, id)}
      id={generatePanelId(index, id)}
      {...props}
    />
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

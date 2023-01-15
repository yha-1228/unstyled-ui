import React, { useId, useState } from 'react';
import { useElements } from '../../hooks/use-elements';
import { createContext, createContextHook } from '../../utils/react';

// Utils
// --------------------

const generateTabId = (index: number, id: string) => `tab-${index}-${id}`;

const generatePanelId = (index: number, id: string) => `panel-${index}-${id}`;

// Root
// --------------------

type ProviderProps = {
  defaultIndex?: number;
  defaultIsNotSelected?: boolean;
  onTabChange?: (selectedIndex: number) => void;
};

type TabsState = {
  id: string;
  activeIndex: number | undefined;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
};

type TabsContextValue = TabsState & ProviderProps;

const TabsContext = createContext<TabsContextValue>();

const useTabsContext = createContextHook(TabsContext, {
  hookName: 'useTabsContext',
  providerName: 'Tabs',
});

const INITIAL_TAB_INDEX = 0;

function Root(props: React.ComponentPropsWithoutRef<'div'> & ProviderProps) {
  const { defaultIndex, defaultIsNotSelected, onTabChange, ...divProps } =
    props;

  const id = useId();

  const [activeIndex, setActiveIndex] = useState(() => {
    if (props.defaultIsNotSelected) return undefined;
    if (props.defaultIndex) return props.defaultIndex;
    return INITIAL_TAB_INDEX;
  });

  const tabsContextValue: TabsContextValue = {
    id,
    activeIndex,
    setActiveIndex,

    // ---
    defaultIndex,
    defaultIsNotSelected,
    onTabChange,
  };

  return (
    <TabsContext.Provider value={tabsContextValue}>
      <div {...divProps} />
    </TabsContext.Provider>
  );
}

// Tab
// --------------------

type TabProps = React.ComponentPropsWithRef<'button'>;

type TabRef = HTMLButtonElement;

const Tab = React.forwardRef<TabRef, TabProps>((props, ref) => (
  <button ref={ref} type="button" role="tab" {...props} />
));

Tab.displayName = 'Tab';

// TabList
// --------------------

type TabListProps = Omit<React.ComponentPropsWithRef<'div'>, 'children'> & {
  children: React.ReactElement[] | React.ReactElement;
};

type TabListRef = HTMLDivElement;

type InjectTabDataAttrs = {
  'data-state': 'active' | 'inactive';
};

const TabList = React.forwardRef<TabListRef, TabListProps>((props, ref) => {
  const { children, ...propsExcludeChildren } = props;

  const { id, activeIndex, setActiveIndex, onTabChange } = useTabsContext();

  const { elements, ref: tabRef } = useElements<HTMLButtonElement>();

  const actionTabChange = (selectedIndex: number) => {
    elements[selectedIndex].focus();
    setActiveIndex(selectedIndex);
    onTabChange?.(selectedIndex);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      const nextActiveIndex =
        activeIndex === elements.length - 1 ? 0 : activeIndex! + 1;
      actionTabChange(nextActiveIndex);
    }

    if (e.key === 'ArrowLeft') {
      const nextActiveIndex =
        activeIndex === 0 ? elements.length - 1 : activeIndex! - 1;
      actionTabChange(nextActiveIndex);
    }
  };

  return (
    <div
      role="tablist"
      {...propsExcludeChildren}
      onKeyDown={handleKeyDown}
      ref={ref}
    >
      {React.Children.map(children, (children, index) => {
        const selected =
          activeIndex === undefined ? false : index === activeIndex;

        return React.cloneElement<TabProps & InjectTabDataAttrs>(children, {
          key: index,
          ref: tabRef,
          tabIndex: selected ? 0 : -1,
          onClick: () => actionTabChange(index),
          'aria-selected': selected,
          'aria-controls': generatePanelId(index, id),
          id: generateTabId(index, id),
          'data-state': selected ? 'active' : 'inactive',
        });
      })}
    </div>
  );
});

TabList.displayName = 'TabList';

// Panel
// --------------------

type PanelProps = React.ComponentPropsWithRef<'div'>;

type PanelRef = HTMLDivElement;

const Panel = React.forwardRef<PanelRef, PanelProps>((props, ref) => (
  <div ref={ref} role="tabpanel" {...props} />
));

Panel.displayName = 'Panel';

// PanelList
// --------------------

type PanelListProps = React.ComponentPropsWithRef<'div'> & {
  children: React.ReactElement[] | React.ReactElement;
};

type PanelListRef = HTMLDivElement;

const PanelList = React.forwardRef<PanelListRef, PanelListProps>(
  (props, ref) => {
    const { children, ...propsExcludeChildren } = props;

    const { id, activeIndex } = useTabsContext();

    if (activeIndex === undefined) return null;

    return (
      <div {...propsExcludeChildren} ref={ref}>
        {React.Children.map(children, (children, index) => {
          const selected = index === activeIndex;

          return (
            selected &&
            React.cloneElement<PanelProps>(children, {
              key: index,
              'aria-labelledby': generateTabId(index, id),
              id: generatePanelId(index, id),
            })
          );
        })}
      </div>
    );
  }
);

PanelList.displayName = 'PanelList';

// export
// --------------------

export const Tabs = Object.assign(Root, {
  TabList,
  Tab,
  PanelList,
  Panel,
});

import React, { useId, useState } from 'react';
import { useElements } from '../../hooks/use-elements';
import { selectFocus } from '../../utils/dom';
import { contextFactory, contextHookFactory } from '../../utils/react';

// Utils
// --------------------

const generateTabId = (index: number, id: string) => `tab-${index}-${id}`;

const generatePanelId = (index: number, id: string) => `panel-${index}-${id}`;

// Provider
// --------------------

type ProviderPropsAsContext = {
  defaultIndex?: number;
  defaultIsNotSelected?: boolean;
  onTabChange?: (selectedIndex: number) => void;
};

type ProviderProps = React.ComponentPropsWithoutRef<'div'> &
  ProviderPropsAsContext;

type TabsState = {
  id: string;
  activeIndex: number | undefined;
  setActiveIndex: (index: number) => void;
};

type TabsContextValue = TabsState & ProviderPropsAsContext;

const TabsContext = contextFactory<TabsContextValue>();

const useTabsContext = contextHookFactory(
  TabsContext,
  'useTabsContext must be inside <Tabs.Provider />'
);

const INITIAL_TAB_INDEX = 0;

function Provider(props: ProviderProps) {
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
    selectFocus(elements, selectedIndex);
    setActiveIndex(selectedIndex);
    onTabChange?.(selectedIndex);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      const nextIndex =
        activeIndex === elements.length - 1 ? 0 : activeIndex! + 1;
      actionTabChange(nextIndex);
    }

    if (e.key === 'ArrowLeft') {
      const nextIndex =
        activeIndex === 0 ? elements.length - 1 : activeIndex! - 1;
      actionTabChange(nextIndex);
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
          tabIndex: index === activeIndex ? 0 : -1,
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

export const Tabs = {
  Provider,
  TabList,
  Tab,
  PanelList,
  Panel,
};

import React from 'react';
import { Tabs } from './tabs';

// Tabsをパネルなしで使うため、
// Tabのarea-controlsを削除して再エクスポート

type SegmentRef = HTMLButtonElement;

const Segment = React.forwardRef<
  SegmentRef,
  React.ComponentPropsWithRef<typeof Tabs.Tab>
>((props, ref) => {
  const { 'aria-controls': aria_controls, ...rest } = props;

  return <Tabs.Tab aria-controls={aria_controls} {...rest} ref={ref} />;
});

Segment.displayName = 'Segment';

export const SegmentedContorl = {
  Root: Tabs.Root,
  SegmentList: Tabs.TabList,
  Segment,
};

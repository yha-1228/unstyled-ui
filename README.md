スタイルを持たないUIコンポーネント集です。利用者が`className`を割り当てることで任意のデザインを作成できます。

# Components

## Tabs

```tsx
const tabListStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
});

const tabStyle = css({
  border: 'none',
  padding: 8,
  width: '100%',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'lightgray',
  },
  '&[data-state="active"]': {
    backgroundColor: 'blue',
    color: 'white',
    '&:hover': {
      backgroundColor: 'darkblue',
    },
  },
});

const Component = () => {
  return (
    <Tabs.Provider defaultIndex={0}>
      <Tabs.TabList className={tabListStyle}>
        <Tabs.Tab className={tabStyle}>Tab A</Tabs.Tab>
        <Tabs.Tab className={tabStyle}>Tab B</Tabs.Tab>
        <Tabs.Tab className={tabStyle}>Tab C</Tabs.Tab>
      </Tabs.TabList>
      <Tabs.PanelList>
        <Tabs.Panel>Content A</Tabs.Panel>
        <Tabs.Panel>Content B</Tabs.Panel>
        <Tabs.Panel>Content C</Tabs.Panel>
      </Tabs.PanelList>
    </Tabs.Provider>
  );
};
```

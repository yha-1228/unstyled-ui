import { css } from '@emotion/css';
import { useLocalStorage } from 'react-use';
import { Tabs } from '../components/tabs/tabs';

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

export function TabsExample() {
  const [tabIndex, setTabIndex] = useLocalStorage(
    'unstyled/tabs/APP__TAB_INDEX',
    1
  );

  console.log('render <App />');

  return (
    <div>
      <h1>Demo</h1>

      <Tabs defaultIndex={tabIndex} onTabChange={setTabIndex}>
        <Tabs.TabList className={tabListStyle}>
          <Tabs.Tab className={tabStyle}>HTML</Tabs.Tab>
          <Tabs.Tab className={tabStyle}>CSS</Tabs.Tab>
          <Tabs.Tab className={tabStyle}>JavaScript</Tabs.Tab>
        </Tabs.TabList>
        <Tabs.PanelList>
          <Tabs.Panel>HTML is markup language.</Tabs.Panel>
          <Tabs.Panel>CSS is stylesheet.</Tabs.Panel>
          <Tabs.Panel>
            <JavaScriptDetail />
          </Tabs.Panel>
        </Tabs.PanelList>
      </Tabs>

      <div>
        <hr />
        current tabIndex: {tabIndex}
      </div>
    </div>
  );
}

// ---

function JavaScriptDetail() {
  const [tabIndex, setTabIndex] = useLocalStorage(
    'unstyled/tabs/JAVASCRIPT_DETAIL__TAB_INDEX',
    1
  );

  console.log('render <JavaScriptDetail />');

  return (
    <div
      className={css({
        border: '2px solid lightgray',
        borderRadius: 4,
        padding: 16,
      })}
    >
      JavaScript is not Java.
      <hr />
      <Tabs defaultIndex={tabIndex} onTabChange={setTabIndex}>
        <Tabs.TabList className={tabListStyle}>
          <Tabs.Tab className={tabStyle}>React</Tabs.Tab>
          <Tabs.Tab className={tabStyle}>Angular</Tabs.Tab>
          <Tabs.Tab className={tabStyle}>Vue</Tabs.Tab>
        </Tabs.TabList>
        <Tabs.PanelList>
          <Tabs.Panel>made by meta</Tabs.Panel>
          <Tabs.Panel>made by google</Tabs.Panel>
          <Tabs.Panel>made by evan you</Tabs.Panel>
        </Tabs.PanelList>
      </Tabs>
    </div>
  );
}

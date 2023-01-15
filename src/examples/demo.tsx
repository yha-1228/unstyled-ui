import { css } from '@emotion/css';
import { useLocalStorage } from 'react-use';
import { Tabs } from '../components/tabs';
import { SegmentedContorl } from '../components/tabs/segmented-contorl';

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

export function Demo() {
  const [tabIndex, setTabIndex] = useLocalStorage(
    'unstyled/tabs/APP__TAB_INDEX',
    1
  );

  console.log('render <App />');

  return (
    <div>
      <h1>Demo</h1>

      <Tabs.Root defaultIndex={tabIndex} onIndexChange={setTabIndex}>
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
      </Tabs.Root>

      <div>
        <hr />
        current tabIndex: {tabIndex}
      </div>

      <SegmentedContorl.Root>
        <SegmentedContorl.SegmentList>
          <SegmentedContorl.Segment
            className={css({ '&[data-state="active"]': { color: 'blue' } })}
          >
            day
          </SegmentedContorl.Segment>
          <SegmentedContorl.Segment
            className={css({ '&[data-state="active"]': { color: 'blue' } })}
          >
            week
          </SegmentedContorl.Segment>
          <SegmentedContorl.Segment
            className={css({ '&[data-state="active"]': { color: 'blue' } })}
          >
            month
          </SegmentedContorl.Segment>
        </SegmentedContorl.SegmentList>
      </SegmentedContorl.Root>
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
      <Tabs.Root defaultIndex={tabIndex} onIndexChange={setTabIndex}>
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
      </Tabs.Root>
    </div>
  );
}

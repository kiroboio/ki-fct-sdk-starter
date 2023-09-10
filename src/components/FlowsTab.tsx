import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

export default function FlowsTab() {
  return (
    <Tabs isFitted>
      <TabList>
        <Tab>Active</Tab>
        <Tab>History</Tab>
        <Tab>Drafts</Tab>
        <Tab>Expired</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <p>Active</p>
        </TabPanel>
        <TabPanel>
          <p>History</p>
        </TabPanel>
        <TabPanel>
          <p>Drafts</p>
        </TabPanel>
        <TabPanel>
          <p>Expired</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

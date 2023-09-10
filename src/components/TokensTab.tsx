import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

export default function TokensTab() {
  return (
    <Tabs isFitted>
      <TabList>
        <Tab>Vault</Tab>
        <Tab>Wallet</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <p>one!</p>
        </TabPanel>
        <TabPanel>
          <p>two!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

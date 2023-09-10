import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import TokensTab from './TokensTab'
import NFTTab from './NFTsTab'
import FlowsTab from './FlowsTab'

export default function AccountContent() {
  return (
    <>
      <Tabs variant="soft-rounded" isFitted>
        <TabList>
          <Tab>Tokens</Tab>
          <Tab>NFTs</Tab>
          <Tab>Flows</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TokensTab />
          </TabPanel>
          <TabPanel>
            <NFTTab />
          </TabPanel>
          <TabPanel>
            <FlowsTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}

//@ts-nocheck
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  DrawerFooter,
  Stack,
  HStack,
  Center,
} from '@chakra-ui/react'
import { service, useComputed } from '@kiroboio/fct-sdk'
import { useState } from 'react'
import { pack, unpack } from '../utils/format'
import NetworkTag from './NetworkTag'
import MemoTokenCard from './TokenCard'
import MemoNFTCard from './NFTCard'
import WalletTab from './WalletTab'

const AccountPage = ({ isOpen, onClose }: { isOpen: any; onClose: any }) => {
  const [, setIsWallet] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const wIsLoading = useComputed(() => service.tokens.wallet.data.isLoading.value)
  const vIsLoading = useComputed(() => service.tokens.vault.data.isLoading.value)
  const wTokens = useComputed(() => pack(service.tokens.wallet.data.fmt.list.value))
  const vTokens = useComputed(() => pack(service.tokens.vault.data.fmt.list.value))
  const wNFTS = useComputed(() => pack(service.nfts.wallet.data.fmt.list.value))
  const vNFTS = useComputed(() => pack(service.nfts.vault.data.fmt.list.value))

  const tokens = {
    wallet: useComputed(() => (
      <>{wIsLoading.value ? <Center>Loading...</Center> : unpack(wTokens.value).map((id) => <MemoTokenCard key={id} id={id} isWallet={true} />)}</>
    )),
    vault: useComputed(() => (
      <>{vIsLoading.value ? <Center>Loading...</Center> : unpack(vTokens.value).map((id) => <MemoTokenCard key={id} id={id} isWallet={false} />)}</>
    )),
  }
  const nfts = {
    wallet: useComputed(() => (
      <>{wIsLoading.value ? <Center>Loading...</Center> : unpack(wNFTS.value).map((id) => <MemoNFTCard key={id} id={id} isWallet={true} />)}</>
    )),
    vault: useComputed(() => (
      <>{vIsLoading.value ? <Center>Loading...</Center> : unpack(vNFTS.value).map((id) => <MemoNFTCard key={id} id={id} isWallet={false} />)}</>
    )),
  }

  const handleTabsChange = (index: number) => {
    setTabIndex(index)
    setIsWallet(index === 1 ? true : false)
  }

  return (
    <Tabs isFitted>
      <Drawer size="sm" placement="right" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay backdropFilter="auto" backdropBlur="4px" />
        <DrawerContent m={4} rounded="lg">
          <DrawerCloseButton />
          <DrawerHeader>
            <Text>Account</Text>
          </DrawerHeader>

          <DrawerBody>
            <Tabs size="lg" variant="solid-rounded" isFitted index={tabIndex} onChange={handleTabsChange}>
              <TabList>
                <WalletTab id="smartwallet" />
                <WalletTab id="wallet" />
              </TabList>
              <TabPanels>
                <TabPanel p={0} pt={4}>
                  <Tabs isFitted>
                    <TabList>
                      <Tab>Tokens</Tab>
                      <Tab>NFTs</Tab>
                      <Tab>Flows</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel p={0} pt={4}>
                        <Stack spacing={1} overflowY="auto" maxH="h-full">
                          <>{tokens.vault}</>
                        </Stack>
                      </TabPanel>
                      <TabPanel p={0} pt={4}>
                        <HStack spacing={4}>
                          <>{nfts.vault}</>
                        </HStack>
                      </TabPanel>
                      <TabPanel>
                        <p>Smart Wallet FCTs!</p>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </TabPanel>
                <TabPanel p={0} pt={4}>
                  <Tabs isFitted>
                    <TabList position="sticky" top={0}>
                      <Tab>Tokens</Tab>
                      <Tab>NFTs</Tab>
                      <Tab>Flows</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel p={0} pt={4}>
                        <Stack spacing={1} overflowY="auto" maxH="h-full">
                          <>{tokens.wallet}</>
                        </Stack>
                      </TabPanel>
                      <TabPanel p={0} pt={4}>
                        <HStack spacing={4}>
                          <>{nfts.wallet}</>
                        </HStack>
                      </TabPanel>
                      <TabPanel>
                        <p>Connected Wallet FCTs!</p>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </DrawerBody>
          <DrawerFooter justifyContent="flex-start">
            <NetworkTag />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Tabs>
  )
}

export default AccountPage

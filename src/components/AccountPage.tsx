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
  Stack,
  HStack,
  DrawerFooter,
  TagLabel,
  Tag,
} from '@chakra-ui/react'
import { service, useComputed } from '@kiroboio/fct-sdk'
import { useState } from 'react'

import NetworkTag from './NetworkTag'
import WalletCard from './WalletCard'

import TokensTab from './TokensTab'
import NFTSTab from './NFTSTab'
import FCTSTab from './FCTSTab'

const AccountPage = ({ isOpen, onClose }: { isOpen: any; onClose: any }) => {
  const [isWallet, setIsWallet] = useState(false)

  const smartWallet = {
    address: {
      fmt: useComputed(() => service.vault.data.fmt.value.address),
      raw: useComputed(() => service.vault.data.raw.value.address),
    },
    balance: {
      fmt: useComputed(() =>
        service.tokens.vault.data.fmt.list.value
          .reduce((prev, current) => prev + +current.price.usd * +current.amount.replace(/,/g, ''), 0)
          .toFixed(2)
      ),
      raw: useComputed(() => service.tokens.vault.data.raw.list.value.reduce((prev, current) => prev + +current.price.usd * +current.amount, 0)),
    },
  }

  const connectedWallet = {
    address: {
      fmt: useComputed(() => service.wallet.data.fmt.value.address),
      raw: useComputed(() => service.wallet.data.raw.value.address),
    },
    balance: {
      fmt: useComputed(() =>
        service.tokens.wallet.data.fmt.list.value
          .reduce((prev, current) => prev + +current.price.usd * +current.amount.replace(/,/g, ''), 0)
          .toFixed(2)
      ),
      raw: useComputed(() => service.tokens.wallet.data.raw.list.value.reduce((prev, current) => prev + +current.price.usd * +current.amount, 0)),
    },
  }

  const tokens = {
    smartWallet: {
      fmt: useComputed(() => service.tokens.vault.data.fmt.list.value),
      raw: useComputed(() => service.tokens.vault.data.raw.list.value),
    },
    connectedWallet: {
      fmt: useComputed(() => service.tokens.wallet.data.fmt.list.value),
      raw: useComputed(() => service.tokens.wallet.data.raw.list.value),
    },
  }

  const nfts = {
    smartWallet: {
      fmt: useComputed(() => service.nfts.vault.data.fmt.list.value),
      raw: useComputed(() => service.nfts.vault.data.raw.list.value),
    },
    connectedWallet: {
      fmt: useComputed(() => service.nfts.wallet.data.fmt.list.value),
      raw: useComputed(() => service.nfts.wallet.data.raw.list.value),
    },
  }

  const fcts = useComputed(() => service.fct.active.data.fmt.list.value)

  const wallet = useComputed(() => service.wallet.data.fmt.value.address)
  const vault = useComputed(() => service.vault.data.fmt.value.address)

  const vTokens = useComputed(() => service.tokens.vault.data.fmt.list.value)
  const vTokensRaw = useComputed(() => service.tokens.vault.data.raw.list.value)
  const vNFTS = useComputed(() => service.nfts.vault.data.fmt.list.value)
  const FCTS = useComputed(() => service.fct.active.data.fmt.list.value)
  const wTokens = useComputed(() => service.tokens.wallet.data.fmt.list.value)
  const wTokensRaw = useComputed(() => service.tokens.wallet.data.raw.list.value)
  const wNFTS = useComputed(() => service.nfts.wallet.data.fmt.list.value)

  const vBalance = vTokens.value.reduce((prev, current) => prev + +current.price.usd * +current.amount.replace(/,/g, ''), 0).toFixed(2)
  const wBalance = wTokens.value.reduce((prev, current) => prev + +current.price.usd * +current.amount.replace(/,/g, ''), 0).toFixed(2)

  return (
    <Tabs isFitted>
      <Drawer size="sm" placement="right" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay backdropFilter="auto" backdropBlur="4px" />
        <DrawerContent m={4} rounded="lg">
          <DrawerCloseButton />
          <DrawerHeader>
            <Stack spacing={8}>
              <Text>Account</Text>
              <HStack justify="space-between">
                <WalletCard
                  onClick={() => setIsWallet(false)}
                  address={smartWallet.address}
                  balance={`$${smartWallet.balance.fmt.value}`}
                  title="Smart Wallet"
                  icon="fluent:brain-circuit-20-filled"
                  isSelect={!isWallet}
                />
                <WalletCard
                  onClick={() => setIsWallet(true)}
                  address={connectedWallet.address}
                  balance={`$${connectedWallet.balance.fmt.value}`}
                  title="Connected Wallet"
                  icon="fluent:wallet-32-filled"
                  isSelect={isWallet}
                />
              </HStack>
              <TabList>
                <Tab gap={2}>
                  <Text>Tokens</Text>
                  <Tag variant="solid">
                    <TagLabel>{isWallet ? tokens.connectedWallet.fmt.value.length : tokens.smartWallet.fmt.value.length}</TagLabel>
                  </Tag>
                </Tab>
                <Tab gap={2}>
                  <Text>NFTs</Text>
                  <Tag variant="solid">
                    <TagLabel>{isWallet ? nfts.connectedWallet.fmt.value.length : nfts.smartWallet.fmt.value.length}</TagLabel>
                  </Tag>
                </Tab>
                <Tab gap={2}>
                  <Text>FCTs</Text>
                  <Tag variant="solid">
                    <TagLabel>{fcts.value.length}</TagLabel>
                  </Tag>
                </Tab>
              </TabList>
            </Stack>
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing={8}>
              <TabPanels>
                <TabPanel px={0}>
                  <TokensTab tokens={isWallet ? tokens.connectedWallet : tokens.smartWallet} isWallet={isWallet} />
                </TabPanel>
                {/* <TabPanel px={0}>
                  <NFTSTab nfts={nfts} />
                </TabPanel>
                <TabPanel px={0}>
                  <FCTSTab fcts={fcts} />
                </TabPanel> */}
              </TabPanels>
            </Stack>
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

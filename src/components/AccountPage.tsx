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
  Card,
  CardBody,
  Stack,
  HStack,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Divider,
  Input,
  Checkbox,
} from '@chakra-ui/react'

import NetworkTag from './NetworkTag'
import { service, useComputed } from '@kiroboio/fct-sdk'
import { memo, useState } from 'react'

const pack = (list: Partial<{ id: string }>[]) => {
  return JSON.stringify(list.map((item) => item.id))
}

const unpack = (packed: string): string[] => JSON.parse(packed)

const TokenCard = ({ id, isWallet }: { id: string; isWallet: boolean }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const tokens = isWallet ? service.tokens.wallet.data.fmt.map : service.tokens.vault.data.fmt.map
  const name = useComputed(() => tokens.value[id]?.name)
  const amount = useComputed(() => tokens.value[id]?.amount)
  return (
    <>
      <Card variant="outline">
        <CardBody>
          <HStack justify="space-between">
            <Text fontWeight="bold">
              <>{name}</>
            </Text>
            <Text>
              <>{amount}</>
            </Text>
            <Button size="sm" onClick={onOpen}>
              Transfer
            </Button>
          </HStack>
        </CardBody>
      </Card>
      <ModalTransfer isOpen={isOpen} onClose={onClose} id={id} isWallet={isWallet} />
    </>
  )
}
const MemoTokenCard = memo(TokenCard)

const NFTCard = ({ id, isWallet }: { id: string; isWallet: boolean }) => {
  const nfts = isWallet ? service.nfts.wallet.data.fmt.map : service.nfts.vault.data.fmt.map
  const name = useComputed(() => nfts.value[id]?.name)
  const symbol = useComputed(() => nfts.value[id]?.symbol)
  return (
    <Card variant="outline">
      <CardBody>
        <Text>
          <>{name}</>
        </Text>
        <Text>
          <>{symbol}</>
        </Text>
      </CardBody>
    </Card>
  )
}
const MemoNFTCard = memo(NFTCard)

const ModalTransfer = ({ isOpen, onClose, id, isWallet }: { isOpen: any; onClose: any; id: string; isWallet: boolean }) => {
  const tokens = isWallet ? service.tokens.wallet.data.fmt.map : service.tokens.vault.data.fmt.map
  const name = useComputed(() => tokens.value[id]?.name)
  const symbol = useComputed(() => tokens.value[id]?.symbol)
  const amount = useComputed(() => tokens.value[id]?.amount)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Transfer <>{symbol}</> from your {isWallet ? 'connected wallet' : 'smart wallet'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Balance:{' '}
            <Text as="strong">
              <>{amount}</>
            </Text>
          </Text>
          <FormControl>
            <Input />
            <Divider />
            <Input />
            <Checkbox>Send to your {isWallet ? 'smart wallet' : 'connected wallet'}</Checkbox>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost">Send</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const AccountPage = ({ isOpen, onClose }: { isOpen: any; onClose: any }) => {
  const [isWallet, setIsWallet] = useState(false)
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
                <Tab rounded="md">Smart Wallet</Tab>
                <Tab rounded="md">Connected Wallet</Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0} pt={4}>
                  <Tabs variant="solid-rounded" isFitted isLazy>
                    <TabList>
                      <Tab rounded="md">Tokens</Tab>
                      <Tab rounded="md">NFTS</Tab>
                      <Tab rounded="md">FCTS</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel p={0} pt={4}>
                        <Stack spacing={4}>
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
                  <Tabs variant="solid-rounded" isFitted isLazy>
                    <TabList>
                      <Tab rounded="md">Tokens</Tab>
                      <Tab rounded="md">NFTS</Tab>
                      <Tab rounded="md">FCTS</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel p={0} pt={4}>
                        <Stack spacing={4}>
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

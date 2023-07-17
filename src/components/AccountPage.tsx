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
  SimpleGrid,
  Alert,
  AlertTitle,
  AlertDescription,
  Button,
  Heading,
} from '@chakra-ui/react'
import { service, useComputed } from '@kiroboio/fct-sdk'
import { useEffect, useState } from 'react'
import { pack, unpack } from '../utils/format'
import NetworkTag from './NetworkTag'
import MemoTokenCard from './TokenCard'
import MemoNFTCard from './NFTCard'
import WalletTab from './WalletTab'
import { Icon } from '@iconify/react'
import { zeroAddress } from 'viem'

const AccountPage = ({ isOpen, onClose }: { isOpen: any; onClose: any }) => {
  const [, setIsWallet] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const wIsLoading = useComputed(() => service.tokens.wallet.data.isLoading.value)
  const vIsLoading = useComputed(() => service.tokens.vault.data.isLoading.value)
  const wTokens = useComputed(() => pack(service.tokens.wallet.data.fmt.list.value))
  const vTokens = useComputed(() => pack(service.tokens.vault.data.fmt.list.value))
  const wNFTS = useComputed(() => pack(service.nfts.wallet.data.fmt.list.value))
  const vNFTS = useComputed(() => pack(service.nfts.vault.data.fmt.list.value))
  const FCTS = useComputed(() => pack(service.fct.active.data.fmt.list.value))
  const isCreateValueRunning = useComputed(() => service.wallet.vaultFactory.createVault.isRunning().value)
  const [hasVault, setHasVault] = useState(false)
  const vaultAddress = useComputed(() => service.vault.data.raw.value.address)

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

  const createVault = async () => {
    try {
      const res = await service.wallet.vaultFactory.createVault.execute('createVault', {
        inputs: {},
      })
      if (!res.error) {
        service.session.login()
        setHasVault(true)
      }
    } catch (e) {
      console.log('createVault error:', service.wallet.erc20.approve.state('allowance').value)
    }
  }

  useEffect(() => {
    setHasVault(vaultAddress.value !== zeroAddress)
  }, [vaultAddress.value])

  return (
    <>
      <Drawer size="sm" placement="right" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay backdropFilter="auto" backdropBlur="4px" />
        <DrawerContent m={4} rounded="lg">
          <DrawerCloseButton />

          {!hasVault ? (
            <Stack w="full" h="full" justify="center" spacing={4} align="center" textAlign="center" p={12}>
              <Icon icon="streamline:money-safe-vault-saving-combo-payment-safe-money-combination-finance" width="48px" height="48px" />
              <Heading>Create Vault</Heading>
              <Text>Kirobo Liquid Vault keeps your assets backed-up and secured while using and accessing them on a daily basis</Text>
              <Button isLoading={isCreateValueRunning.value} onClick={createVault} colorScheme="messenger">
                Create Vault
              </Button>
            </Stack>
          ) : (
            <>
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
                            {service.tokens.vault.data.fmt.list.value.length === 0 ? (
                              <Alert
                                status="info"
                                variant="subtle"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                textAlign="center"
                                rounded="lg"
                                height="200px">
                                <Icon icon="iconoir:network-right" width="40px" height="40px" />
                                <AlertTitle mt={4} mb={1} fontSize="lg">
                                  No Tokens yet
                                </AlertTitle>
                                <AlertDescription maxWidth="xs">Buy or transfer tokens to this wallet to get started.</AlertDescription>
                              </Alert>
                            ) : (
                              <Stack spacing={1} overflowY="auto" maxH="h-full">
                                <>{tokens.vault}</>
                              </Stack>
                            )}
                          </TabPanel>
                          <TabPanel p={0} pt={4}>
                            <HStack spacing={4}>
                              {service.nfts.vault.data.fmt.list.value.length === 0 ? (
                                <Alert
                                  status="info"
                                  variant="subtle"
                                  flexDirection="column"
                                  alignItems="center"
                                  justifyContent="center"
                                  textAlign="center"
                                  rounded="lg"
                                  height="200px">
                                  <Icon icon="icon-park-outline:picture-album" width="40px" height="40px" />
                                  <AlertTitle mt={4} mb={1} fontSize="lg">
                                    No NFTs yet
                                  </AlertTitle>
                                  <AlertDescription maxWidth="xs">Buy or transfer NFTs to this wallet to get started.</AlertDescription>
                                </Alert>
                              ) : (
                                <SimpleGrid columns={[1, 3]} gap={3}>
                                  <>{nfts.vault}</>
                                </SimpleGrid>
                              )}
                            </HStack>
                          </TabPanel>
                          <TabPanel p={0} pt={4}>
                            {service.fct.active.data.fmt.list.value.length === 0 ||
                              (!hasVault && (
                                <Alert
                                  status="info"
                                  variant="subtle"
                                  flexDirection="column"
                                  alignItems="center"
                                  justifyContent="center"
                                  textAlign="center"
                                  rounded="lg"
                                  height="200px">
                                  <Icon icon="iconoir:network-right" width="40px" height="40px" />
                                  <AlertTitle mt={4} mb={1} fontSize="lg">
                                    No FCTs yet
                                  </AlertTitle>
                                  <AlertDescription maxWidth="xs">Create a new FCT using Kirobo UI Builder to get started.</AlertDescription>
                                </Alert>
                              ))}
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
                            {service.tokens.wallet.data.fmt.list.value.length === 0 ? (
                              <Alert
                                status="info"
                                variant="subtle"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                textAlign="center"
                                rounded="lg"
                                height="200px">
                                <Icon icon="iconoir:network-right" width="40px" height="40px" />
                                <AlertTitle mt={4} mb={1} fontSize="lg">
                                  No Tokens yet
                                </AlertTitle>
                                <AlertDescription maxWidth="xs">Buy or transfer tokens to this wallet to get started.</AlertDescription>
                              </Alert>
                            ) : (
                              <Stack spacing={1} overflowY="auto" maxH="h-full">
                                <>{tokens.wallet}</>
                              </Stack>
                            )}
                          </TabPanel>
                          <TabPanel p={0} pt={4}>
                            {service.nfts.wallet.data.fmt.list.value.length === 0 ? (
                              <Alert
                                status="info"
                                variant="subtle"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                textAlign="center"
                                rounded="lg"
                                height="200px">
                                <Icon icon="icon-park-outline:picture-album" width="40px" height="40px" />
                                <AlertTitle mt={4} mb={1} fontSize="lg">
                                  No NFTs yet
                                </AlertTitle>
                                <AlertDescription maxWidth="xs">Buy or transfer NFTs to this wallet to get started.</AlertDescription>
                              </Alert>
                            ) : (
                              <SimpleGrid columns={[1, 3]} gap={3}>
                                <>{nfts.wallet}</>
                              </SimpleGrid>
                            )}
                          </TabPanel>
                          <TabPanel p={0} pt={4}>
                            {service.fct.active.data.fmt.list.value.length === 0 ||
                              (!hasVault && (
                                <Alert
                                  status="info"
                                  variant="subtle"
                                  flexDirection="column"
                                  alignItems="center"
                                  justifyContent="center"
                                  textAlign="center"
                                  rounded="lg"
                                  height="200px">
                                  <Icon icon="iconoir:network-right" width="40px" height="40px" />
                                  <AlertTitle mt={4} mb={1} fontSize="lg">
                                    No FCTs yet
                                  </AlertTitle>
                                  <AlertDescription maxWidth="xs">Create a new FCT using Kirobo UI Builder to get started.</AlertDescription>
                                </Alert>
                              ))}
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
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default AccountPage

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
  Box,
  Image,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
  ButtonGroup,
} from '@chakra-ui/react'
import { NumericFormat } from 'react-number-format'
import NetworkTag from './NetworkTag'
import { service, useComputed } from '@kiroboio/fct-sdk'
import { memo, useState } from 'react'

const unFormatValue = (value: any) => {
  return +value.toString().replace(/,/g, '').replace('$', '')
}

const pack = (list: Partial<{ id: string }>[]) => JSON.stringify(list.map((item) => item.id))
const unpack = (packed: string): string[] => JSON.parse(packed)

const TokenCard = ({ id, isWallet }: { id: string; isWallet: boolean }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const tokens = isWallet ? service.tokens.wallet.data.fmt.map : service.tokens.vault.data.fmt.map
  const name = useComputed(() => tokens.value[id]?.name)
  const amount = useComputed(() => tokens.value[id]?.amount)
  const price = useComputed(() => tokens.value[id]?.price.usd)
  const total = useComputed(() => +amount.value * +price.value)

  return (
    <>
      <Card variant="outline">
        <CardBody>
          <HStack justify="space-between">
            <Text fontWeight="bold">
              <>{name}</>
            </Text>
            <Stack spacing={1}>
              <Text fontWeight="bold">
                <>{amount}</>
              </Text>
              <Text color="gray.500">
                $<>{price}</>
              </Text>
            </Stack>
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
  const meta = useComputed(() => nfts.value[id]?.metadata)
  const symbol = useComputed(() => nfts.value[id]?.symbol)
  return (
    <Card variant="outline">
      <CardBody>
        <Stack spacing={4}>
          <Image src={JSON.parse(meta.value).image} alt="naruto" />
          <Stack spacing={1}>
            <Text fontWeight="bold">
              <>{name}</>
            </Text>
            <Text>
              <>{symbol}</>
            </Text>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  )
}
const MemoNFTCard = memo(NFTCard)

const ModalTransfer = ({ isOpen, onClose, id, isWallet }: { isOpen: any; onClose: any; id: string; isWallet: boolean }) => {
  const [transferWalletAddress, setTransferWalletAddress] = useState('')
  const [transferAmount, setTransferAmount] = useState<any>(0)
  const [transferPrice, setTransferPrice] = useState<any>(0)
  const [error, setError] = useState('')
  const [isSending, setIsSending] = useState(false)

  const tokens = isWallet ? service.tokens.wallet.data.raw.map : service.tokens.vault.data.raw.map
  const tokensFmt = isWallet ? service.tokens.wallet.data.fmt.map : service.tokens.vault.data.fmt.map
  const symbol = useComputed(() => tokens.value[id]?.symbol)
  const amount = useComputed(() => tokens.value[id]?.amount)
  const amountFmt = useComputed(() => tokensFmt.value[id]?.amount)
  const price = useComputed(() => tokens.value[id]?.price.usd)
  const tokenAddress = useComputed(() => tokens.value[id]?.token_address)

  const isError = transferWalletAddress === '' || unFormatValue(transferAmount) > unFormatValue(amountFmt.value) || unFormatValue(transferAmount) <= 0

  const handleModalClose = () => {
    setTransferWalletAddress('')
    setTransferAmount('')
    setTransferPrice('')
    setError('')
    setIsSending(false)
    onClose()
  }

  const handleSelectWallet = (e: any) => {
    e.target.checked
      ? isWallet
        ? setTransferWalletAddress(service.vault.data.raw.value.address)
        : setTransferWalletAddress(service.wallet.data.raw.value.address)
      : setTransferWalletAddress('')
  }

  const handleSetMaxBalance = () => {
    setTransferAmount(unFormatValue(amountFmt.value))
    setTransferPrice(unFormatValue(amountFmt.value) * unFormatValue(price.value))
  }

  const handleTransfer = async () => {
    console.log(transferAmount, transferWalletAddress, tokenAddress.value)

    setError('')
    setIsSending(true)

    if (isWallet) {
      await service.wallet.erc20.transfer
        .execute('transfer', {
          to: transferWalletAddress,
          amount: transferAmount + '0'.repeat(18),
          token: tokenAddress.peek() || '',
        })
        .then((res: any) => {
          console.log(res)
          if (res.results) {
            handleModalClose()
          } else {
            setError(res.error.message)
          }
          setIsSending(false)
        })
    } else {
      await service.vault.erc20.transfer
        .execute('transfer', {
          to: transferWalletAddress,
          amount: transferAmount + '0'.repeat(18),
          token: tokenAddress.peek() || '',
        })
        .then((res: any) => {
          console.log(res)
          if (res.results) {
            handleModalClose()
          } else {
            setIsSending(false)
            setError(res.error.message)
          }
        })
    }
  }

  const handleTransferAmountChange = (value: any) => {
    setTransferAmount(value)
    setTransferPrice(unFormatValue(value) * price.value)
  }

  const handleTransferPriceChange = (value: any) => {
    setTransferPrice(value)
    setTransferAmount(unFormatValue(value) / unFormatValue(price.value))
  }

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
              <>
                {amountFmt} {symbol}
              </>
            </Text>
          </Text>
          <FormControl mt={4}>
            <Stack spacing={5}>
              <Stack spacing={2}>
                <NumericFormat
                  variant="unstyled"
                  value={transferAmount}
                  placeholder="0.0"
                  textAlign="center"
                  fontSize="3xl"
                  autoComplete="off"
                  customInput={Input}
                  isDisabled={isSending}
                  onChange={(e) => handleTransferAmountChange(e.target.value)}
                  thousandSeparator
                />
                ;
                <Divider my={-5} />
                <NumericFormat
                  prefix="$"
                  variant="unstyled"
                  placeholder="0.0"
                  textAlign="center"
                  fontSize="3xl"
                  autoComplete="off"
                  value={transferPrice}
                  customInput={Input}
                  isDisabled={isSending}
                  onChange={(e) => handleTransferPriceChange(e.target.value)}
                  thousandSeparator
                />
                ;
                <Box textAlign="center">
                  <ButtonGroup>
                    <Button isDisabled={isSending} size="sm" onClick={handleSetMaxBalance}>
                      Max
                    </Button>
                  </ButtonGroup>
                </Box>
              </Stack>
              <Stack spacing={2}>
                <Checkbox disabled={isSending} onChange={handleSelectWallet}>
                  Move to your {isWallet ? 'smart wallet' : 'connected wallet'}
                </Checkbox>
                <Input
                  disabled={isSending}
                  placeholder="Ethereum Address"
                  value={transferWalletAddress}
                  onChange={(e) => setTransferWalletAddress(e.target.value)}
                />
              </Stack>
            </Stack>
          </FormControl>
          {error && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              <AlertDescription maxWidth="sm">{error}</AlertDescription>
              <CloseButton position="absolute" right="8px" top="8px" onClick={() => setError('')} />
            </Alert>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" isDisabled={isError} onClick={handleTransfer} isLoading={isSending}>
            Send
          </Button>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

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
              <TabList position="sticky" top={0}>
                <Tab rounded="md">Smart Wallet</Tab>
                <Tab rounded="md">Connected Wallet</Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0} pt={4}>
                  <Tabs variant="solid-rounded" isFitted>
                    <TabList position="sticky" top={0}>
                      <Tab rounded="md">Tokens</Tab>
                      <Tab rounded="md">NFTS</Tab>
                      <Tab rounded="md">FCTS</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel p={0} pt={4}>
                        <Stack spacing={4} overflowY="auto" maxH="h-full">
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
                  <Tabs variant="solid-rounded" isFitted>
                    <TabList position="sticky" top={0}>
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

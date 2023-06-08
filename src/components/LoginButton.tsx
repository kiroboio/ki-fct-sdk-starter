import {
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  HStack,
  Card,
  CardBody,
  Alert,
  AlertDescription,
  AlertTitle,
  IconButton,
  DrawerFooter,
  TagLabel,
  Tag,
  Avatar,
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useClipboard,
  SimpleGrid,
  Heading,
  AspectRatio,
  Image,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  NumberInput,
  NumberInputField,
  Divider,
  FormLabel,
} from '@chakra-ui/react'
import { CheckIcon, CopyIcon } from '@chakra-ui/icons'
import { Icon } from '@iconify/react'
import { service, useComputed } from '@kiroboio/fct-sdk'
import { useState } from 'react'

type WalletProps = {
  title: string
  address: any
  usd: string
  icon: string
  isSelect?: boolean
  onClick?: any
}

type TokenProps = {
  symbol: string
  amount: string
  logo: string
  name: string
  price: {
    usd: number
    protocol: string
  }
  onClickSend: any
}

type NFTProps = {
  name: string
  symbol: string
  token_id: string
  metadata?: any
}

const WalletCard = (props: WalletProps) => {
  const { isSelect, onClick, title, address, usd, icon } = props
  const { onCopy, hasCopied } = useClipboard(address)
  return (
    <Card
      w="full"
      variant={isSelect ? 'outline' : 'solid'}
      borderColor={isSelect ? 'messenger.500' : 'blackAlpha.200'}
      borderWidth={3}
      onClick={onClick}
      cursor="pointer">
      <CardBody>
        <Text fontSize="md" fontWeight="bold">
          {title}
        </Text>
        <HStack spacing={1}>
          <Text fontSize="sm" color="gray.500">
            <>{address}</>
          </Text>
          <IconButton size="xs" rounded="full" aria-label="Copy Address" icon={hasCopied ? <CheckIcon /> : <CopyIcon />} onClick={onCopy} />
        </HStack>
        <HStack mt={3}>
          <Icon icon={icon} width="24px" height="24px" />
          <Text fontWeight="extrabold">{usd}</Text>
        </HStack>
      </CardBody>
    </Card>
  )
}

const TokenCard = (props: TokenProps) => {
  const { symbol, amount, price, logo, name, onClickSend } = props
  return (
    <Card size="sm" variant="outline" rounded="md" shadow="sm">
      <CardBody px={5}>
        <HStack justify="space-between">
          <HStack>
            <Avatar size="xs" src={logo} />
            <Stack spacing={-1}>
              <Text fontWeight="bold">{symbol}</Text>
              <Text fontSize="sm" color="gray.500">
                {name}
              </Text>
            </Stack>
          </HStack>
          <HStack spacing={4}>
            <Stack spacing={-1} textAlign="right">
              <Text fontWeight="bold">{amount}</Text>
              <Text fontSize="sm" color="gray.500">
                ${(price.usd * +amount.replace(/,/g, '')).toFixed(2)}
              </Text>
            </Stack>
            <IconButton size="sm" rounded="full" aria-label="Copy Address" icon={<Icon icon="akar-icons:arrow-right" />} onClick={onClickSend} />
          </HStack>
        </HStack>
      </CardBody>
    </Card>
  )
}

const NFTCard = (props: NFTProps) => {
  const { name, symbol, token_id, metadata } = props
  return (
    <Card variant="outline" shadow="sm" p={0} m={0}>
      <CardBody p={0} m={0}>
        <Stack spacing={2}>
          <AspectRatio ratio={1}>
            <Image src={JSON.parse(metadata).image} alt="naruto" roundedTop="md" />
          </AspectRatio>
          <Stack spacing={1} py={2} px={3}>
            <Heading fontSize="sm">{name}</Heading>
            <HStack fontSize="xs" justify="space-between" color="gray.500">
              <Text>{symbol}</Text>
              <Text>{token_id}</Text>
            </HStack>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  )
}

const TokensTab = (props: { tokens: any }) => {
  const { tokens } = props
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      {tokens.length === 0 && (
        <Alert
          status="info"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          rounded="lg"
          height="200px">
          <Icon icon="radix-icons:tokens" width="40px" height="40px" />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            No tokens yet
          </AlertTitle>
          <AlertDescription maxWidth="xs">Buy or transfer tokens to this wallet to get started.</AlertDescription>
        </Alert>
      )}
      {tokens && (
        <Stack spacing={1}>
          {tokens.map((token: TokenProps, index: number) => (
            <TokenCard key={index} {...token} onClickSend={onOpen} />
          ))}
        </Stack>
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send from vault</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Vault balance: 1.5 ETH</Text>
            <FormControl textAlign="center" px={12}>
              <NumberInput defaultValue={0.0} min={0} precision={2} variant="unstyled" m={0} p={0}>
                <NumberInputField textAlign="center" fontSize="5xl" pr={0} />
              </NumberInput>
              <Divider mb={3} />
              <Text my={3}>0.00</Text>
              <Button variant="outline" size="xs">
                Max
              </Button>
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
    </>
  )
}

const FCTsTab = (props: { fcts: any }) => {
  const { fcts } = props
  return (
    <>
      {fcts.length === 0 && (
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
      )}
      {fcts.length > 0 && (
        <Stack spacing={3}>
          {fcts.map((fct: any, index: number) => (
            <Card key={index} variant="outline">
              <CardBody>
                <Stack spacing={3}>
                  <Box>
                    <Text fontWeight="bold">Untitled #{index + 1}</Text>
                    <Badge>{fct.status}</Badge>
                  </Box>
                  <HStack justify="space-between" fontSize="sm">
                    <Text>
                      Gas Price: <Text as="strong">{fct.gas_price_limit} Gwai</Text>
                    </Text>
                    <Text color="gray.500">{fct.createdAt}</Text>
                  </HStack>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </Stack>
      )}
    </>
  )
}

const NFTsTab = (props: { nfts: any }) => {
  const { nfts } = props
  return (
    <>
      {nfts.length === 0 && (
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
      )}
      {nfts && (
        <SimpleGrid columns={3} spacing={3}>
          {nfts.map((nft: any, index: number) => (
            <NFTCard key={index} {...nft} />
          ))}
        </SimpleGrid>
      )}
    </>
  )
}

const NetworkTag = () => {
  const fuel = useComputed(() => service.fct.fuel.data.fmt.value)
  const gasPrice = useComputed(() => (+service.network.data.raw.value.gasPrice / 1e9).toFixed(2) + ' Gwei')
  return (
    <HStack justifyContent="space-between" w="full" fontSize="sm">
      <HStack>
        <Icon icon={`solar:fire-square-bold`} width={24} />
        <Box fontWeight="semibold">
          <Text display="inline" color="gray.500" fontWeight="normal">
            FCT Power:
          </Text>{' '}
          {fuel.value.balance.eth} ETH
        </Box>
      </HStack>
      <HStack>
        <Icon icon={`uis:chart`} width={24} />
        <Box fontWeight="semibold">
          <Text display="inline" color="gray.500" fontWeight="normal">
            Network:
          </Text>{' '}
          <>{gasPrice}</>
        </Box>
      </HStack>
    </HStack>
  )
}

const AccountPage = ({ isOpen, onClose }: { isOpen: any; onClose: any }) => {
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

  const [tab, setTab] = useState(0)

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
                  onClick={() => setTab(0)}
                  address={vault}
                  usd={`$${vBalance}`}
                  title="My Vault"
                  icon="fluent:cube-32-filled"
                  isSelect={tab === 0}
                />
                <WalletCard
                  onClick={() => setTab(1)}
                  address={wallet}
                  usd={`$${wBalance}`}
                  title="My Wallet"
                  icon="fluent:wallet-32-filled"
                  isSelect={tab === 1}
                />
              </HStack>
              <TabList>
                <Tab gap={2}>
                  <Text>Tokens</Text>
                  <Tag variant="solid">
                    <TagLabel>{tab === 0 ? vTokens.value.length : wTokens.value.length}</TagLabel>
                  </Tag>
                </Tab>
                <Tab gap={2}>
                  <Text>NFTs</Text>
                  <Tag variant="solid">
                    <TagLabel>{tab === 0 ? vNFTS.value.length : wNFTS.value.length}</TagLabel>
                  </Tag>
                </Tab>
                <Tab gap={2}>
                  <Text>FCTs</Text>
                  <Tag variant="solid">
                    <TagLabel>{FCTS.value.length}</TagLabel>
                  </Tag>
                </Tab>
              </TabList>
            </Stack>
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing={8}>
              <TabPanels>
                <TabPanel px={0}>
                  <TokensTab tokens={tab === 0 ? vTokens.value : wTokens.value} />
                </TabPanel>
                <TabPanel px={0}>
                  <NFTsTab nfts={tab === 0 ? vNFTS.value : wNFTS.value} />
                </TabPanel>
                <TabPanel px={0}>
                  <FCTsTab fcts={FCTS.value} />
                </TabPanel>
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
const KiroButton = ({ onOpen }: { onOpen: any }) => {
  const loggedInLabel = useComputed(() =>
    service.session.status.value === 'loggingIn' ? 'Please wait...' : service.session.status.value === 'loggedIn' ? 'My account' : 'Login'
  )
  const handleClick = () => {
    if (service.session.state.value !== 'authorized' || service.session.status.value === 'loggingIn') {
      return
    }
    if (service.session.status.value === 'loggedIn') {
      onOpen()
    } else {
      service.session.login()
    }
  }
  return (
    <Button colorScheme="messenger" rounded="xl" fontWeight="normal" onClick={handleClick}>
      <>{loggedInLabel}</>
    </Button>
  )
}

export default function LoginButton() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <KiroButton onOpen={onOpen} />
      <AccountPage isOpen={isOpen} onClose={onClose} />
    </>
  )
}

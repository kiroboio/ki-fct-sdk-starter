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
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'
import { Icon } from '@iconify/react'
import { service, useComputed } from '@kiroboio/fct-sdk'
import { useState } from 'react'

const NFTS = []

type WalletProps = {
  title: string
  address: any
  usd: string
  icon: string
  isSelect?: boolean
  onClick?: () => any
}

type TokenProps = {
  symbol: string
  amount: string
  logo: string
  price: {
    usd: number
    protocol: string
  }
}

const WalletCard = (props: WalletProps) => {
  const { isSelect, onClick, title, address, usd, icon } = props
  return (
    <Card w="full" variant={isSelect ? 'outline' : 'solid'} onClick={onClick} cursor="pointer">
      <CardBody>
        <Text fontSize="md" fontWeight="bold">
          {title}
        </Text>
        <HStack spacing={1}>
          <Text fontSize="sm" color="gray.500">
            <>{address}</>
          </Text>
          <IconButton size="xs" rounded="full" aria-label="Copy Address" icon={<CopyIcon />} />
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
  const { symbol, amount, price, logo } = props
  return (
    <Card size="sm" variant="outline" rounded="md">
      <CardBody px={5}>
        <HStack justify="space-between">
          <HStack>
            <Avatar size="xs" src={logo} />
            <Text fontWeight="bold">{symbol}</Text>
          </HStack>
          <Stack spacing={-1} textAlign="right">
            <Text fontWeight="bold">{amount}</Text>
            <Text fontSize="sm" color="gray.500">
              ${(price.usd * +amount.replace(/,/g, '')).toFixed(2)}
            </Text>
          </Stack>
        </HStack>
      </CardBody>
    </Card>
  )
}

const TokensTab = (props: { tokens: any }) => {
  const { tokens } = props
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
            <TokenCard key={index} {...token} />
          ))}
        </Stack>
      )}
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
      <Stack spacing={3}>
        <TableContainer>
          <Table variant="striped" size="sm">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Created at</Th>
                <Th>Gas Price</Th>
                <Th>Status</Th>
                <Th>Stage</Th>
              </Tr>
            </Thead>
            <Tbody>
              {fcts &&
                fcts.map((fct: any, index: number) => (
                  <Tr key={index}>
                    <Td>Untitled #{index}</Td>
                    <Td>{fct.createdAt}</Td>
                    <Td>{fct.gas_price_limit} gwei</Td>
                    <Td>{fct.status}</Td>
                    <Td>{fct.stage}</Td>
                  </Tr>
                ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Name</Th>
                <Th>Created at</Th>
                <Th>Gas Price</Th>
                <Th>Status</Th>
                <Th>Stage</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </Stack>
    </>
  )
}

const NFTsTab = () => {
  return (
    <>
      {NFTS.length === 0 && (
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
    </>
  )
}

const NetworkTag = () => {
  const gasPrice = useComputed(() => (+service.network.data.raw.value.gasPrice / 1e9).toFixed(2) + ' Gwei')
  return (
    <HStack>
      <Icon icon={`uis:chart`} width={24} />
      <Box fontWeight="semibold">
        <Text display="inline" color="gray.500" fontWeight="normal">
          Network:
        </Text>{' '}
        <>{gasPrice}</>
      </Box>
    </HStack>
  )
}
const AccountPage = ({ isOpen, onClose }: { isOpen: any; onClose: any }) => {
  const wallet = useComputed(() => service.wallet.data.fmt.value.address)
  const vault = useComputed(() => service.vault.data.fmt.value.address)
  const vTokens = useComputed(() => service.tokens.vault.data.fmt.list.value)
  const vNFTS = useComputed(() => service.nfts.vault.data.fmt.list.value)
  const FCTS = useComputed(() => service.fct.active.data.fmt.list.value)
  const wTokens = useComputed(() => service.tokens.wallet.data.fmt.list.value)
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
                  <NFTsTab />
                </TabPanel>
                <TabPanel px={0}>
                  <FCTsTab fcts={FCTS.value} />
                </TabPanel>
              </TabPanels>
            </Stack>
          </DrawerBody>
          <DrawerFooter>
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

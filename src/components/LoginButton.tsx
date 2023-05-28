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
} from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'
import { Icon } from '@iconify/react'
import { service, useComputed } from '@kiroboio/fct-sdk'

const TOKENS = [
  { symbol: 'ETH', balance: '0', usd: '$0.00' },
  { symbol: 'BTC', balance: '0', usd: '$0.00' },
  { symbol: 'USDT', balance: '0', usd: '$0.00' },
  { symbol: 'USDC', balance: '0', usd: '$0.00' },
]
const NFTS = []
const FCTS = []

type WalletProps = {
  title: string
  address: any
  usd: string
  icon: string
  isSelect?: boolean
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
  const { isSelect, title, address, usd, icon } = props
  return (
    <Card w="full" variant={isSelect ? 'outline' : 'solid'} cursor={isSelect ? 'auto' : 'pointer'}>
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
              {price.usd}
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
        {fcts &&
          fcts.map((fct: any, index: number) => (
            <Stack key={index}>
              <Text>{fct.id}</Text>
              <Text>{fct.createdAt}</Text>
            </Stack>
          ))}
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
      <Text fontWeight="semibold">
        <Text display="inline" color="gray.500" fontWeight="normal">
          Network:
        </Text>{' '}
        <>{gasPrice}</>
      </Text>
    </HStack>
  )
}
const AccountPage = ({ isOpen, onClose }: { isOpen: any; onClose: any }) => {
  const wallet = useComputed(() => service.wallet.data.fmt.value.address)
  const vault = useComputed(() => service.vault.data.fmt.value.address)
  const vTokens = useComputed(() => service.tokens.vault.data.fmt.list.value)
  const vNFTS = useComputed(() => service.nfts.vault.data.fmt.list.value)
  const vFTCs = useComputed(() => service.fct.active.data.fmt.list.value)

  console.log(vFTCs.value)

  return (
    <Drawer size="sm" placement="right" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay backdropFilter="auto" backdropBlur="4px" />
      <DrawerContent m={4} rounded="lg">
        <DrawerCloseButton />
        <DrawerHeader>
          <Stack spacing={8}>
            <Text>Account</Text>
          </Stack>
        </DrawerHeader>

        <DrawerBody>
          <Stack spacing={8}>
            <HStack justify="space-between">
              <WalletCard address={wallet} usd="$5,380.19" title="My Vault" icon="fluent:cube-32-filled" isSelect />
              <WalletCard address={vault} usd="$7,129.07" title="My Wallet" icon="fluent:wallet-32-filled" />
            </HStack>

            <Tabs isFitted>
              <TabList>
                <Tab gap={2}>
                  <Text>Tokens</Text>
                  <Tag variant="solid">
                    <TagLabel>{vTokens.value.length}</TagLabel>
                  </Tag>
                </Tab>
                <Tab gap={2}>
                  <Text>NFTs</Text>
                  <Tag variant="solid">
                    <TagLabel>{vNFTS.value.length}</TagLabel>
                  </Tag>
                </Tab>
                <Tab gap={2}>
                  <Text>FCTs</Text>
                  <Tag variant="solid">
                    <TagLabel>{vFTCs.value.length}</TagLabel>
                  </Tag>
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0}>
                  <TokensTab tokens={vTokens.value} />
                </TabPanel>
                <TabPanel px={0}>
                  <NFTsTab />
                </TabPanel>
                <TabPanel px={0}>
                  <FCTsTab fcts={vFTCs.value} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>
        </DrawerBody>
        <DrawerFooter>
          <NetworkTag />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
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

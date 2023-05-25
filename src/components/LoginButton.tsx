import { CopyIcon } from '@chakra-ui/icons'
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
  Divider,
  DrawerFooter,
} from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import { useRef } from 'react'

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
  address: string
  usd: string
  icon: string
  isSelect?: boolean
}

type TokenProps = {
  symbol: string
  balance: string
  usd: string
}

const WalletCard = (props: WalletProps) => {
  const { isSelect, title, address, usd, icon } = props
  return (
    <Card w="full" variant={props.isSelect ? 'filled' : 'outline'}>
      <CardBody>
        <Text fontSize="md" fontWeight="bold">
          {title}
        </Text>
        <HStack spacing={1}>
          <Text fontSize="sm" color="gray.500">
            {address}
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
  const { symbol, balance, usd } = props
  return (
    <Card size="sm" variant="outline" rounded="md">
      <CardBody px={4}>
        <HStack justify="space-between">
          <HStack>
            <Icon icon={`cryptocurrency-color:${symbol.toLowerCase()}`} width={24} />
            <Text fontWeight="bold">{symbol}</Text>
          </HStack>
          <Stack spacing={-1} textAlign="right">
            <Text fontWeight="bold">{balance}</Text>
            <Text fontSize="sm" color="gray.500">
              {usd}
            </Text>
          </Stack>
        </HStack>
      </CardBody>
    </Card>
  )
}

const TokensTab = (tokens: TokenProps[]) => {
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

const FCTsTab = () => {
  return (
    <>
      {FCTS.length === 0 && (
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
          <AlertDescription maxWidth="xs">Create a new FCT using Kirobo's UI Builder to get started.</AlertDescription>
        </Alert>
      )}
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

const NetworkTag = () => (
  <HStack>
    <Icon icon={`uis:chart`} width={24} />
    <Text fontWeight="semibold">
      <Text display="inline" color="gray.500" fontWeight="normal">
        Network:
      </Text>{' '}
      96.97 gwei
    </Text>
  </HStack>
)

export default function LoginButton() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  return (
    <>
      <Button colorScheme="messenger" rounded="xl" fontWeight="normal" ref={btnRef} onClick={onOpen}>
        Login with Kirobo
      </Button>
      <Drawer size="sm" placement="right" isOpen={isOpen} onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay backdropFilter="auto" backdropBlur="4px" />
        <DrawerContent m={4} rounded="lg" border="1px solid" borderColor="gray.600">
          <DrawerCloseButton />
          <DrawerHeader>
            <Stack spacing={8}>
              <Text>Account</Text>
            </Stack>
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing={8}>
              <HStack justify="space-between">
                <WalletCard address="0x692F...dA58" usd="$5,380.19" title="My Vault" icon="fluent:cube-32-filled" isSelect />
                <WalletCard address="0x41ed...be66" usd="$7,129.07" title="My Wallet" icon="fluent:wallet-32-filled" />
              </HStack>
              <Divider />
              <Tabs variant="solid-rounded" isFitted>
                <TabList>
                  <Tab>Tokens</Tab>
                  <Tab>NFTs</Tab>
                  <Tab>FCTs</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel px={0}>
                    <TokensTab tokens={TOKENS} />
                  </TabPanel>
                  <TabPanel px={0}>
                    <FCTsTab />
                  </TabPanel>
                  <TabPanel px={0}>
                    <NFTsTab />
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
    </>
  )
}

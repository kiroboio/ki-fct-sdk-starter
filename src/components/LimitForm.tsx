//@ts-nocheck
import {
  Button,
  Card,
  CardBody,
  Divider,
  FormControl,
  FormHelperText,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
  InputLeftAddon,
  InputRightAddon,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  LinkBox,
  LinkOverlay,
  Box,
  useColorModeValue,
  Avatar,
} from '@chakra-ui/react'
import { RefObject, SetStateAction, useContext, useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { FiChevronDown } from 'react-icons/fi'
import { IoSearch } from 'react-icons/io5'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { service, useComputed, core, plugins } from '@kiroboio/fct-sdk'
import { TokenContext } from 'providers/Token'
interface TokenBoxProps {
  symbol: string
  name: string
  logo: string
  amount: number
  price?: number
  isSelected?: boolean
  onSelect: (symbol: string, amount: number) => void
}

type LimitOrderParams = {
  tokenIn: { address: string; amount: string }
  tokensOut: { address: string; amount: string; path?: string[] }[]
  netId: string
  name: string
  autoSign?: 'early' | 'late'
}

const active = service.fct.active
const refs: Record<string, RefObject<unknown>> = {}
const isRunning = () => active.publish.isRunning().value

const createLimitOrder = async (params: LimitOrderParams) => {
  if (isRunning()) {
    throw new Error('running')
  }
  const chainId = params.netId === 'goerli' ? '5' : '1'

  const fct = new core.engines.BatchMultiSigCall({ chainId })
  fct.setOptions({
    name: params.name,
    maxGasPrice: service.network.raw.value.gasPrice,
  })

  const WALLET = service.wallet.raw.value.address
  const VAULT = service.vault.raw.value.address
  const AMOUNT_IN = params.tokenIn.amount
  const TOKEN_IN = params.tokenIn.address

  console.log(WALLET, VAULT, AMOUNT_IN, TOKEN_IN)

  // Transfer tokens from wallet to vault
  await fct.create({
    from: VAULT,
    plugin: new plugins.ERC20.actions.TransferFrom({
      chainId,
      initParams: {
        to: TOKEN_IN,
        methodParams: {
          from: WALLET,
          to: VAULT,
          amount: AMOUNT_IN,
        },
      },
    }),
  })

  for (let i = 0; i < params.tokensOut.length; ++i) {
    const tokenOut = params.tokensOut[i]
    const TOKEN_OUT = tokenOut.address
    const AMOUNT_OUT = tokenOut.amount
    const PATH = tokenOut.path || [TOKEN_IN, tokenOut.address]

    const swapPlugin = new plugins.Uniswap.actions.UniswapV2SwapExactTokensForTokens({
      chainId,
      initParams: {
        methodParams: {
          to: WALLET,
          amountIn: AMOUNT_IN,
          amountOutMin: '0',
          deadline: core.variables.globalVariables.blockTimestamp,
          path: PATH,
        },
      },
    })

    await fct.create({
      from: VAULT,
      plugin: new plugins.ERC20.actions.Approve({
        chainId,
        initParams: {
          to: params.tokensOut[i].address,
          methodParams: {
            spender: swapPlugin.input.params.to.value?.toString() || '',
            amount: AMOUNT_IN,
          },
        },
      }),
    })

    // Swap tokens on UniswapV2 and send to wallet
    await fct.create({
      from: VAULT,
      plugin: swapPlugin,
    })

    // Ensure that the amount of tokens meets the minimum limit order treashold
    await fct.create({
      from: VAULT,
      plugin: new plugins.Validator.getters.GreaterEqual({
        chainId,
        initParams: {
          methodParams: {
            // value1: FCT.constants.getFDBack({ callIndex: 1, innerIndex: 0 }),
            value1: fct.variables.getOutputVariable({ index: 3 + 3 * i, innerIndex: -1 }),
            value2: AMOUNT_OUT,
          },
        },
      }),
      options: {
        flow: i === params.tokensOut.length ? core.constants.Flow.OK_CONT_FAIL_REVERT : core.constants.Flow.OK_STOP_FAIL_CONT,
      },
    })
  }

  return { params: { data: fct.exportFCT(), autoSign: params.autoSign, id: 'limit-order' } } // , signatures: [], sign: true })
}

const publishLimitOrder = async (params: LimitOrderParams) => {
  await active.publish.execute('limit-order-test', async () => await createLimitOrder(params)) // , signatures: [], sign: true })
}

const TokenBox: React.FC<TokenBoxProps> = ({ symbol, name, logo, amount, price = 0, isSelected, onSelect }) => (
  <LinkBox py={1} _hover={{ background: useColorModeValue('gray.100', 'gray.900') }}>
    <LinkOverlay
      href="#"
      onClick={() => {
        isSelected ? undefined : onSelect(symbol, amount)
      }}>
      <HStack px={6} py={1} spacing={3} justifyContent="space-between">
        <HStack>
          <Avatar name={symbol} size="sm" src={logo} />
          <Stack spacing={0}>
            <HStack>
              <Text fontSize="sm" fontWeight="bold">
                {symbol}
              </Text>
              {isSelected && <CheckCircleIcon ml="auto" color="green.500" />}
            </HStack>
            <Text fontSize="xs" color="gray.500">
              {name}
            </Text>
          </Stack>
        </HStack>
        <Box textAlign="right">
          <Text fontSize="sm" fontWeight="bold">
            {amount}
          </Text>
          <Text fontSize="xs" color="gray.500">
            ${(price * amount).toFixed(2)}
          </Text>
        </Box>
      </HStack>
    </LinkOverlay>
  </LinkBox>
)

export default function LimitForm() {
  const { inputToken, outputToken, balance, setInputToken, setOutputToken, setBalance } = useContext(TokenContext)
  const [searchText, setSearchText] = useState('')
  const [currentToken, setCurrentToken] = useState('' || inputToken)
  const [inputAmount, setInputAmount] = useState<number>(0)
  const [outputAmount, setOutputAmount] = useState<number>(0)
  const [exchangeRate, setExchangeRate] = useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const tokens = useComputed(() => service.tokens.wallet.raw.list.value)
  const filteredTokens = tokens.value.filter((token) => token.name.toLowerCase().includes(searchText.toLowerCase()))

  console.log(tokens.value)

  const handleTokenSelect = (symbol: any, amount: any) => {
    if (currentToken == inputToken) {
      setInputToken(symbol)
      setBalance(amount)
    } else {
      setOutputToken(symbol)
    }
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (inputAmount && exchangeRate) {
      setOutputAmount(+(inputAmount * exchangeRate).toFixed(2))
    } else {
      setOutputAmount(0)
    }
  }, [inputAmount, exchangeRate])
  return (
    <>
      <Card minW="330px">
        <CardBody>
          <Stack>
            <Heading fontSize="2xl">Limit</Heading>
            <Text>Place a limit order to trade at a set price</Text>
          </Stack>
          <Divider my={6} />
          <Stack spacing={6}>
            <FormControl>
              <HStack justify="space-between" alignContent="center">
                <Text fontWeight="bold">You Send</Text>
                <FormHelperText>Balance: {balance}</FormHelperText>
              </HStack>
              <InputGroup mt={2}>
                <NumberInput defaultValue={inputAmount} flex={1}>
                  <NumberInputField onChange={(e) => setInputAmount(+e.target.value)} />
                  <InputRightElement w="6rem">
                    <Button
                      w="full"
                      mr={1}
                      size="sm"
                      rightIcon={<FiChevronDown />}
                      onClick={() => {
                        setIsModalOpen(true)
                        setCurrentToken(inputToken)
                      }}>
                      {inputToken}
                    </Button>
                  </InputRightElement>
                </NumberInput>
              </InputGroup>
            </FormControl>
            <FormControl>
              <Text fontWeight="bold">Limit Price</Text>
              <InputGroup mt={2}>
                <InputLeftAddon fontSize="sm" fontWeight="bold">
                  1 {inputToken} =
                </InputLeftAddon>
                <Input defaultValue={exchangeRate} onChange={(e) => setExchangeRate(+e.target.value)} />
                <InputRightElement w="6rem">
                  <Button
                    w="full"
                    mr={1}
                    size="sm"
                    rightIcon={<FiChevronDown />}
                    onClick={() => {
                      setIsModalOpen(true)
                      setCurrentToken(outputToken)
                    }}>
                    {outputToken}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Divider />
            <FormControl>
              <HStack justify="space-between" alignContent="center">
                <Text fontWeight="bold">You Get</Text>
              </HStack>
              <InputGroup mt={2}>
                <Input value={outputAmount} readOnly />
                <InputRightAddon fontSize="sm" fontWeight="bold">
                  {outputToken}
                </InputRightAddon>
              </InputGroup>
            </FormControl>
            <Button
              colorScheme="messenger"
              onClick={() =>
                publishLimitOrder({
                  tokenIn: { address: inputToken, amount: inputAmount },
                  tokensOut: [{ address: outputToken, amount: outputAmount }],
                  netId: 'goerli',
                  name: 'limit-order-test',
                })
              }>
              Create limite order
            </Button>
          </Stack>
        </CardBody>
      </Card>
      <Modal size="xs" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay backdropFilter="auto" backdropBlur="2px" />
        <ModalContent rounded="2xl" p={0}>
          <ModalHeader textAlign="center">
            Select a token
            <FormControl my={4}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <IoSearch />
                </InputLeftElement>
                <Input placeholder="Search by name" rounded="xl" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
              </InputGroup>
            </FormControl>
            <Divider />
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody pt={0} px={0} pb={4} maxH="400px" overflowY="auto">
            <Stack spacing={0}>
              {filteredTokens.length > 0 ? (
                filteredTokens.map(({ symbol, name, token_address, logo, price, amount }) => (
                  <TokenBox
                    key={symbol}
                    name={name}
                    symbol={symbol}
                    amount={amount}
                    logo={logo}
                    price={price.usd}
                    onSelect={handleTokenSelect}
                    isSelected={symbol == inputToken || symbol == outputToken}
                  />
                ))
              ) : (
                <Text textAlign="center">No tokens found.</Text>
              )}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

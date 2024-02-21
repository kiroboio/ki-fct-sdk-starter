import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { FiChevronDown, } from 'react-icons/fi'
import { IoSwapVerticalOutline } from 'react-icons/io5'
import { IoSearch } from 'react-icons/io5'
import {
    HStack,
    Stack,
    NumberInput,
    NumberInputField,
    FormControl,
    FormLabel,
    FormHelperText,
    Text,
    Button,
    Box,
    IconButton,
    Flex,
    Card,
    CardBody,
    Heading,
    useColorModeValue,
    Input,
    Divider,
    Show,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Image,
    LinkBox,
    LinkOverlay,
    Switch,
    InputLeftElement,
    Spinner,
} from '@chakra-ui/react'

import { service, useActiveFlowActions, useNetwork, useProviders } from '@kiroboio/fct-sdk'

import TradingViewWidget from '../../components/TradingView'
import { ChainId, FCT_UNISWAP, Utils } from '@kiroboio/fct-core'
import { etherToWei, weiToEther } from '~/utils/number'
import { createLimitOrder } from '~/fct/createLimitOrder'
import BigNumber from 'bignumber.js';

//const currencyOptions = Utils.getSupportedTokens
// const currencyOptions = [
//     { name: 'Uniswap', symbol: 'UNI' },
//     { name: 'USD Coin', symbol: 'USDC' },
//     { name: 'Dai Stablecoin', symbol: 'DAI' },
//     { name: 'Chainlink', symbol: 'LINK' },
//     { name: 'Wrapped BTC', symbol: 'WBTC' },
//     { name: 'AAVE', symbol: 'AAVE' },
//     { name: 'Polygon', symbol: 'MATIC' },
//     { name: 'Compound', symbol: 'COMP' },
//     { name: 'Maker', symbol: 'MKR' },
//     { name: 'Ethereum', symbol: 'ETH' },
//     { name: 'The Graph', symbol: 'GRT' },
//     { name: 'SushiSwap', symbol: 'SUSHI' },
//     { name: 'yearn.finance', symbol: 'YFI' },
//     { name: 'Balancer', symbol: 'BAL' },
//     { name: 'Synthetix', symbol: 'SNX' },
//     { name: 'Ren', symbol: 'REN' },
//     { name: 'Loopring', symbol: 'LRC' },
// ]

type TokenType = ReturnType<typeof Utils.getSupportedTokens>[number]
interface CurrencyOptionProps {
    token: TokenType,
    isSelected?: boolean
    onSelect: (token: TokenType) => void
}

interface TokenOptionProps {
    onTokenSelect: (t: TokenType) => void
    onAmountChange: (a: string) => void
    isLoading?: boolean
    token?: TokenType,
    amount?: string,
    isDisabled?: boolean,
}


const CurrencyOption: React.FC<CurrencyOptionProps> = ({ token, isSelected, onSelect }) => (
    <LinkBox py={1} _hover={{ background: useColorModeValue('gray.100', 'gray.900') }}>
        <LinkOverlay
            href="#"
            onClick={() => {
                onSelect(token)
            }}>
            <HStack px={6} py={1} spacing={3} justifyContent="space-between">
                <HStack>
                    <Image rounded="md" src={token.logoURI} alt={token.symbol} boxSize="5" />
                    <Stack spacing={0}>
                        <HStack>
                            <Text fontSize="sm" fontWeight="bold">
                                {token.symbol}
                            </Text>
                            {isSelected && <CheckCircleIcon ml="auto" color="green.500" />}
                        </HStack>
                        <Text fontSize="xs" color="gray.500">
                            {token.name}
                        </Text>
                    </Stack>
                </HStack>
                <Box textAlign="right">
                    <Text fontSize="sm" fontWeight="bold">
                        0.0
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                        $0.0
                    </Text>
                </Box>
            </HStack>
        </LinkOverlay>
    </LinkBox>
)

const TokenOption: React.FC<TokenOptionProps> = ({ token, amount, onTokenSelect, onAmountChange, isLoading, isDisabled }) => {
    if (!token) return null
    return (
        <>
            <Stack spacing={1}>
                <HStack justify="space-between">
                    <Button
                        variant="ghost"
                        leftIcon={<Image rounded="md" src={token.logoURI} alt={token.symbol} boxSize="5" />}
                        rightIcon={<FiChevronDown />}
                        onClick={() => onTokenSelect(token)}>
                        {token.symbol}
                    </Button>
                </HStack>
                <FormControl>
                    <FormLabel
                        m={0}
                        borderWidth={1}
                        bg={useColorModeValue('gray.50', 'gray.800')}
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        rounded="xl"
                        p={5}
                        _focus={{
                            outlineColor: 'blue.300',
                            outlineWidth: 3,
                            outlineStyle: 'solid',
                        }}>
                        <NumberInput isDisabled={isDisabled} defaultValue={0.0} inputMode="decimal" pattern="^[0-9]*[.,]?[0-9]*$" variant="unstyled" size="lg" textAlign="right" value={amount} onChange={onAmountChange}>
                            {isLoading ? <Spinner boxSize="12px" thickness="1px" /> : <NumberInputField pe={0} textAlign="right" />}
                        </NumberInput>
                    </FormLabel>
                </FormControl>
            </Stack>
        </>
    )
}


const tokens = {
    '1': Utils.getSupportedTokens({ chainId: '1' }).filter((token) => Boolean(token.logoURI) && token.type === 'DEFAULT'),
    '5': Utils.getSupportedTokens({ chainId: '5' }).filter((token) => Boolean(token.logoURI) && token.type === 'DEFAULT'),
}

export const LimitOrder = () => {
    const [showGraph, setShowGraph] = useState(true)
    const [currencyModalType, setCurrencyModalType] = useState<'from' | 'to' | null>(null)
    const [searchText, setSearchText] = useState('')

    const { data: networkData } = useNetwork();
    const chainId = networkData.fmt.chainId as ChainId

    const supportedTokens = tokens[chainId as '1' | '5'] || []
    const [fromToken, setFromToken] = useState<TokenType | undefined>(supportedTokens.find((token) => token.symbol === 'WETH'))
    const [toToken, setToToken] = useState<TokenType | undefined>(supportedTokens.find((token) => token.symbol === 'UNI'))
    
    const [fromAmount, setFromAmount] = useState<string | undefined>()
    const [toAmount, setToAmount] = useState<string | undefined>()
    
    const [limitPrice, setLimitPrice] = useState<string | undefined>()
    const [path, setPath] = useState<string[] | undefined>()
    
    const filteredTokens = supportedTokens.filter((token) => token.symbol?.toLowerCase().includes(searchText.toLowerCase()))
    const {
        gasPrice: {
            fastest: { maxFeePerGas: maxFeePerGasFmt },
        },
    } = networkData.raw;

    const gasPrice = (Number(maxFeePerGasFmt) / 1e9).toFixed(2) + ' Gwei'

    const { uniswap: swap } = useProviders({ id: 'swap' });
    const { uniswap: limitPriceCalculation } = useProviders({ id: 'limit_price' });

    const { publish: publishFlow } = useActiveFlowActions({ id: '' });

    const getUniswapParams = async ({ amountIn, amountOut, isExactIn, type }: { isExactIn: 'true' | 'false', type: 'swap' | 'limit_price', amountIn?: string, amountOut?: string }) => {
        if (!amountIn && !amountOut) return
        const simulateSwap = new FCT_UNISWAP.actions.SwapNoSlippageProtection({ chainId, provider: service.providers.smartRpc(), initParams: { addressIn: fromToken?.address, addressOut: toToken?.address, amountIn: amountIn || undefined, amountOut: amountOut || undefined, isExactIn } })

        const uniswapProvider = type === 'swap' ? swap : limitPriceCalculation
        const uniswapService = {
            create: async (params: any) => {
                const res = await uniswapProvider.execute(params, { multiMode: 'execute-last' });
                return res.results;
            },
            reset: () => {
                uniswapProvider.reset();
            },
        };
        const values = await simulateSwap.calculateValuesOnUserInput?.get({ service: uniswapService })

        console.log({ values })
        return values
    }
    useEffect(() => {
        const setUniswapValuesAsync = async () => {
            if (!fromToken?.address) return
            if (!toToken?.address) return
            if (!fromAmount) return
            const res = await getUniswapParams({ amountIn: etherToWei(fromAmount, fromToken?.decimals), isExactIn: 'true', type: 'swap' })

            if (!res || !res.params.amountOut) {
                setToAmount('0')
                setPath(undefined)
                return
            }
            setToAmount(weiToEther(res.params.amountOut as string, toToken.decimals))
            setPath(res.params.methodParams?.path)
        }

        setUniswapValuesAsync()
    }, [toToken?.address, fromToken?.address, fromAmount])

    useEffect(() => {
        const setUniswapValuesAsync = async () => {
            if (!fromToken?.address) return
            if (!toToken?.address) return
            const res = await getUniswapParams({ amountIn: etherToWei('1', fromToken?.decimals), isExactIn: 'true', type: 'limit_price' })

            if (!res || !res.params.amountOut) return
            setLimitPrice(weiToEther(res.params.amountOut as string, toToken.decimals))
        }

        setUniswapValuesAsync()
    }, [toToken?.address, fromToken?.address])

    const handleToCurrencySelect = (token: TokenType) => {
        if (currencyModalType === 'from') {
            setFromToken(token)
        } else {
            setToToken(token)
        }

        setCurrencyModalType(null)
    }

    const switchTokens = () => {
        let temp = fromToken
        setFromToken(toToken)
        setToToken(temp)
    }

    return (
        <>
            <Flex gap={12} alignItems="flex-start" direction={['column', 'column', 'row']}>
                <Box>
                    <Card minW={['full', 'full', '320px']} rounded="xl">
                        <CardBody p={6}>
                            <Stack spacing={5}>
                                <Stack spacing={2}>
                                    <Heading as="h3" fontSize="xl">
                                        Limit
                                    </Heading>
                                    <Text fontSize="sm">Place a limit order to trade at a set price</Text>
                                </Stack>
                                <Divider />
                                <TokenOption
                                    token={fromToken}
                                    onTokenSelect={() => {
                                        setCurrencyModalType('from')
                                    }}
                                    onAmountChange={setFromAmount}
                                    amount={fromAmount}
                                />
                                <Flex justifyContent="center">
                                    <IconButton colorScheme="blue" rounded="full" icon={<IoSwapVerticalOutline />} aria-label={''} onClick={switchTokens} />
                                </Flex>
                                <TokenOption
                                    token={toToken}
                                    onTokenSelect={() => {
                                        setCurrencyModalType('to')
                                    }}
                                    onAmountChange={setToAmount}
                                    amount={toAmount}
                                    isLoading={swap.state.isRunning}
                                    isDisabled
                                />
                                <FormControl>
                                    <FormLabel textTransform="uppercase" fontSize="sm">
                                        Limit Price
                                    </FormLabel>
                                    <InputGroup size="lg">
                                        <InputLeftAddon rounded="lg" fontSize="sm" fontWeight="bold">
                                            1 {fromToken?.symbol} =
                                        </InputLeftAddon>
                                        <Input value={limitPrice} onChange={(e) => setLimitPrice(e.target.value)} />
                                        <InputRightAddon rounded="lg" fontSize="sm" fontWeight="bold">
                                            {toToken?.symbol}
                                        </InputRightAddon>
                                    </InputGroup>
                                    <FormHelperText textAlign="right" mt={3}>
                                        <strong>Gas Price:</strong> <Text>{gasPrice}</Text>
                                    </FormHelperText>
                                    <Button
                                        padding="1"
                                        variant="solid"
                                        width="full"
                                        isDisabled={!Boolean(path)}
                                        //colorScheme="blue.500"
                                        onClick={async() => {
                                            if (!path) return
                                            if (!fromAmount) return
                                            if (!limitPrice) return

                                            const fct = await createLimitOrder({
                                                limit: etherToWei(new BigNumber(limitPrice).multipliedBy(fromAmount).toString(), toToken?.decimals),
                                                tokenIn: { address: fromToken?.address, amount: etherToWei(fromAmount, fromToken?.decimals) },
                                                tokenOut: { address: toToken?.address, amount: '0' },
                                                path,
                                                chainId,
                                                name: 'limit_order'
                                            })

                                            const res = await publishFlow.execute({ payload: fct, autoSign: 'early' })

                                            console.log({ res })
                                        }}>
                                        {"Publish Fct"}
                                    </Button>
                                </FormControl>
                            </Stack>
                        </CardBody>
                    </Card>
                </Box>
                <Box w="full">
                    <Show above="sm">
                        <FormControl display="flex" alignItems="center" mb={3}>
                            <FormLabel mb="0">
                                <Icon icon="material-symbols:bar-chart-4-bars-rounded" width={24} height={24} />
                            </FormLabel>
                            <Switch colorScheme="messenger" ml={-2} size="sm" defaultChecked={true} onChange={(e) => setShowGraph(e.target.checked)} />
                        </FormControl>
                        {showGraph && <TradingViewWidget from={fromToken?.symbol.toLowerCase()} to={toToken?.symbol.toLowerCase()} />}
                    </Show>
                </Box>
            </Flex>
            <Modal size="xs" isOpen={Boolean(currencyModalType)} onClose={() => setCurrencyModalType(null)}>
                <ModalOverlay backdropFilter="auto" backdropBlur="2px" />
                <ModalContent rounded="2xl" p={0}>
                    <ModalHeader textAlign="center">
                        Select a token
                        <FormControl my={4}>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none">
                                    <IoSearch />
                                </InputLeftElement>
                                <Input
                                    placeholder="Search by name or paste address"
                                    rounded="xl"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </InputGroup>
                        </FormControl>
                        <Divider />
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pt={0} px={0} pb={4} maxH="400px" overflowY="auto">
                        <Stack spacing={0}>
                            {filteredTokens.length > 0 ? (
                                filteredTokens.map((token) => (
                                    <CurrencyOption
                                        key={token.address}
                                        token={token}
                                        onSelect={handleToCurrencySelect}
                                        isSelected={token.value === fromToken?.value || token.value === toToken?.value}
                                    />
                                ))
                            ) : (
                                <Text>No tokens found.</Text>
                            )}
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

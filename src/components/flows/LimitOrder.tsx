//@ts-nocheck
import { SetStateAction, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { FiChevronDown } from 'react-icons/fi'
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
    SimpleGrid,
    Heading,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
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
    StackDivider,
    Alert,
    AlertDescription,
    AlertTitle,
    AlertIcon,
    LinkBox,
    LinkOverlay,
    Switch,
    InputLeftElement,
} from '@chakra-ui/react'

import { useNetwork } from '@kiroboio/fct-sdk'

import TradingViewWidget from '../../components/TradingView'

const currencyOptions = [
    { name: 'Uniswap', symbol: 'UNI' },
    { name: 'USD Coin', symbol: 'USDC' },
    { name: 'Dai Stablecoin', symbol: 'DAI' },
    { name: 'Chainlink', symbol: 'LINK' },
    { name: 'Wrapped BTC', symbol: 'WBTC' },
    { name: 'AAVE', symbol: 'AAVE' },
    { name: 'Polygon', symbol: 'MATIC' },
    { name: 'Compound', symbol: 'COMP' },
    { name: 'Maker', symbol: 'MKR' },
    { name: 'Ethereum', symbol: 'ETH' },
    { name: 'The Graph', symbol: 'GRT' },
    { name: 'SushiSwap', symbol: 'SUSHI' },
    { name: 'yearn.finance', symbol: 'YFI' },
    { name: 'Balancer', symbol: 'BAL' },
    { name: 'Synthetix', symbol: 'SNX' },
    { name: 'Ren', symbol: 'REN' },
    { name: 'Loopring', symbol: 'LRC' },
]

interface CurrencyOptionProps {
    symbol: string
    name: string
    isSelected?: boolean
    onSelect: (symbol: string) => void
}

interface TokenOptionProps {
    token: string
    withButtons?: boolean
    balance?: number
    convertion?: number
    onClick: any
}

interface OrderHistoryProps {
    orders?: OrderProps[]
}

type OrderProps = {
    network: string
    pay: number
    receive: number
    rate: number
    expires_at: string
    created_at: string
}

const CurrencyOption: React.FC<CurrencyOptionProps> = ({ symbol, name, isSelected, onSelect }) => (
    <LinkBox py={1} _hover={{ background: useColorModeValue('gray.100', 'gray.900') }}>
        <LinkOverlay
            href="#"
            onClick={() => {
                isSelected ? undefined : onSelect(symbol)
            }}>
            <HStack px={6} py={1} spacing={3} justifyContent="space-between">
                <HStack>
                    <Icon icon={`cryptocurrency-color:${symbol.toLowerCase()}`} width={28} />
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

const TokenOption: React.FC<TokenOptionProps> = ({ token, withButtons = false, balance = 0, convertion = 0.0, onClick }) => {
    return (
        <>
            <Stack spacing={1}>
                <HStack justify="space-between">
                    <Button
                        variant="ghost"
                        leftIcon={<Icon icon={`cryptocurrency-color:${token.toLowerCase()}`} width={20} />}
                        rightIcon={<FiChevronDown />}
                        onClick={onClick}>
                        {token}
                    </Button>
                    <Text fontSize="xs" color="gray.500" pr={5}>
                        Balance: {balance}
                    </Text>
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
                        <NumberInput defaultValue={0.0} inputMode="decimal" pattern="^[0-9]*[.,]?[0-9]*$" variant="unstyled" size="lg">
                            <NumberInputField textAlign="right" pe={0} />
                        </NumberInput>
                        <FormHelperText textAlign="right">~{convertion} USD</FormHelperText>
                        {withButtons && (
                            <SimpleGrid columns={4} spacing={2} mt={4}>
                                <Button size="xs">25%</Button>
                                <Button size="xs">50%</Button>
                                <Button size="xs">75%</Button>
                                <Button size="xs">100%</Button>
                            </SimpleGrid>
                        )}
                    </FormLabel>
                </FormControl>
            </Stack>
        </>
    )
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => (
    <Card rounded="2xl">
        <CardBody>
            <TableContainer>
                <Table variant="simple">
                    <TableCaption fontSize="sm" color="gray.500">
                        *If the tokens in your wallet are less than the number of pending orders, the order will fail
                    </TableCaption>
                    <Thead>
                        <Tr>
                            <Th>All Chains</Th>
                            <Th isNumeric>Pay</Th>
                            <Th isNumeric>Receive</Th>
                            <Th isNumeric>Rate</Th>
                            <Th>Expiration date</Th>
                            <Th>Creation date</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {orders &&
                            orders.map((order, index) => (
                                <Tr key={index}>
                                    <Td>{order.network}</Td>
                                    <Td isNumeric>{order.pay}</Td>
                                    <Td isNumeric>{order.receive}</Td>
                                    <Td isNumeric>{order.rate}</Td>
                                    <Td>{order.expires_at}</Td>
                                    <Td>{order.created_at}</Td>
                                </Tr>
                            ))}
                        {!orders && (
                            <Tr>
                                <Td colSpan={6} textAlign="center">
                                    <Alert status="info" rounded="lg" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" p={6}>
                                        <AlertIcon boxSize="28px" mr={0} />
                                        <AlertTitle mt={4} mb={1} fontSize="lg">
                                            No orders found
                                        </AlertTitle>
                                        <AlertDescription>Log in to your wallet to create a new order.</AlertDescription>
                                    </Alert>
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </TableContainer>
        </CardBody>
    </Card>
)

export const LimitOrder = () => {
    const [fromToken, setFromToken] = useState('UNI')
    const [toToken, setToToken] = useState('USDC')
    const [currentToken, setCurrentToken] = useState('')
    const [showGraph, setShowGraph] = useState(true)
    const [isToCurrencyModalOpen, setIsToCurrencyModalOpen] = useState(false)
    const [searchText, setSearchText] = useState('')

    const filteredTokens = currencyOptions.filter((token) => token.name.toLowerCase().includes(searchText.toLowerCase()))

    const { data: networkData } = useNetwork();

    const isNetworkSupported = networkData.raw.chainId > 0;

    const {
        gasPrice: {
            fastest: { maxFeePerGas: maxFeePerGasFmt },
        },
    } = networkData.raw;

    const gasPrice = (Number(maxFeePerGasFmt) / 1e9).toFixed(2) + ' Gwei'

    const handleToCurrencySelect = (symbol: SetStateAction<string>) => {
        if (currentToken == fromToken) {
            setFromToken(symbol)
        } else {
            setToToken(symbol)
        }

        setIsToCurrencyModalOpen(false)
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
                                    onClick={() => {
                                        setIsToCurrencyModalOpen(true)
                                        setCurrentToken(fromToken)
                                    }}
                                    withButtons
                                />
                                <Flex justifyContent="center">
                                    <IconButton colorScheme="blue" rounded="full" icon={<IoSwapVerticalOutline />} aria-label={''} onClick={switchTokens} />
                                </Flex>
                                <TokenOption
                                    token={toToken}
                                    onClick={() => {
                                        setIsToCurrencyModalOpen(true)
                                        setCurrentToken(toToken)
                                    }}
                                />
                                <FormControl>
                                    <FormLabel textTransform="uppercase" fontSize="sm">
                                        Limit Price
                                    </FormLabel>
                                    <InputGroup size="lg">
                                        <InputLeftAddon rounded="lg" fontSize="sm" fontWeight="bold">
                                            1 {fromToken} =
                                        </InputLeftAddon>
                                        <Input value="1872.6273" />
                                        <InputRightAddon rounded="lg" fontSize="sm" fontWeight="bold">
                                            {toToken}
                                        </InputRightAddon>
                                    </InputGroup>
                                    <FormHelperText textAlign="right" mt={3}>
                                        <strong>Gas Price:</strong> <Text>{gasPrice}</Text>
                                    </FormHelperText>
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
                        {showGraph && <TradingViewWidget from={fromToken} to={toToken} />}
                    </Show>
                    <Box mt={14}>
                        <Heading textAlign="left" fontSize="2xl" mb={5}>
                            Order History
                        </Heading>
                        <OrderHistory />
                    </Box>
                </Box>
            </Flex>
            <Modal size="xs" isOpen={isToCurrencyModalOpen} onClose={() => setIsToCurrencyModalOpen(false)}>
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
                                filteredTokens.map(({ symbol, name }) => (
                                    <CurrencyOption
                                        key={symbol}
                                        symbol={symbol}
                                        name={name}
                                        onSelect={handleToCurrencySelect}
                                        isSelected={symbol == fromToken || symbol == toToken}
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

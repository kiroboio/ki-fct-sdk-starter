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
import { useContext, useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { FiChevronDown } from 'react-icons/fi'
import { IoSearch } from 'react-icons/io5'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { service, useComputed } from '@kiroboio/fct-sdk'
import { TokenContext } from 'providers/Token'

import { publishLimitOrder } from 'utils/fct'
interface TokenBoxProps {
  symbol: string
  name: string
  logo: string
  amount: number
  price?: number
  isSelected?: boolean
  onSelect: (symbol: string, amount: number) => void
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

  const tokens = useComputed(() => service.tokens.wallet.data.fmt.list.value)
  const filteredTokens = tokens.value.filter((token) => token.name.toLowerCase().includes(searchText.toLowerCase()))

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
                <Text fontWeight="bold">You Sell</Text>
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
                <Text fontWeight="bold">You receive at least</Text>
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

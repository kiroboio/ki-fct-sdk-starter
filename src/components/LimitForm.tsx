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
  Center,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { FiChevronDown } from 'react-icons/fi'
import { IoSearch } from 'react-icons/io5'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { pack, unpack } from '../utils/format'
import { service, useComputed } from '@kiroboio/fct-sdk'

interface TokenBoxProps {
  id: string
  isWallet?: boolean
  isSelected?: boolean
}

const TokenBox: React.FC<TokenBoxProps> = ({ id, isWallet, isSelected }) => {
  const tokens = isWallet ? service.tokens.wallet.data.fmt.map : service.tokens.vault.data.fmt.map
  const name = useComputed(() => tokens.value[id]?.name)
  const balance = useComputed(() => tokens.value[id]?.balance)
  const balanceUsd = useComputed(() => tokens.value[id].balanceUsd)
  const logoURL = useComputed(() => tokens.value[id]?.logo)
  const symbol = useComputed(() => tokens.value[id]?.symbol)
  return (
    <LinkBox py={1} _hover={{ background: useColorModeValue('gray.100', 'gray.900') }}>
      <LinkOverlay href="#">
        <HStack px={6} py={1} spacing={3} justifyContent="space-between">
          <HStack>
            <Icon icon={`cryptocurrency-color:${symbol}`} width={28} />
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
              {balance}
            </Text>
            <Text fontSize="xs" color="gray.500">
              ${balance}
            </Text>
          </Box>
        </HStack>
      </LinkOverlay>
    </LinkBox>
  )
}

export default function LimitForm() {
  const [searchText, setSearchText] = useState('')
  const [outputToken, setOutputToken] = useState('')
  const [inputToken, setInputToken] = useState('')
  const [inputAmount, setInputAmount] = useState<number>(0)
  const [outputAmount, setOutputAmount] = useState<number>(0)
  const [exchangeRate, setExchangeRate] = useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isLoggedIn = service.session.status.value === 'loggedIn'

  const wIsLoading = useComputed(() => service.tokens.wallet.data.isLoading.value)
  const vIsLoading = useComputed(() => service.tokens.vault.data.isLoading.value)

  const wTokens = useComputed(() => pack(service.tokens.wallet.data.fmt.list.value))
  const vTokens = useComputed(() => pack(service.tokens.vault.data.fmt.list.value))

  const tokens = {
    wallet: useComputed(() => (
      <>{wIsLoading.value ? <Center>Loading...</Center> : unpack(wTokens.value).map((id) => <TokenBox key={id} id={id} isWallet={true} />)}</>
    )),
    vault: useComputed(() => (
      <>{vIsLoading.value ? <Center>Loading...</Center> : unpack(vTokens.value).map((id) => <TokenBox key={id} id={id} isWallet={false} />)}</>
    )),
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
                <FormHelperText>Balance: 0</FormHelperText>
              </HStack>
              <InputGroup mt={2}>
                <NumberInput defaultValue={inputAmount} flex={1}>
                  <NumberInputField onChange={(e) => setInputAmount(+e.target.value)} disabled={!isLoggedIn} />
                  <InputRightElement w="6rem" ml="auto">
                    <Button w="full" mr={1} size="sm" rightIcon={<FiChevronDown />} onClick={() => setIsModalOpen(true)} isDisabled={!isLoggedIn}>
                      USDC
                    </Button>
                  </InputRightElement>
                </NumberInput>
              </InputGroup>
            </FormControl>
            <FormControl>
              <Text fontWeight="bold">Limit Price</Text>
              <InputGroup mt={2}>
                <InputLeftAddon fontSize="sm" fontWeight="bold">
                  1 USDC =
                </InputLeftAddon>
                <Input defaultValue={exchangeRate} onChange={(e) => setExchangeRate(+e.target.value)} isDisabled={!isLoggedIn} />
                <InputRightElement w="6rem" ml="auto">
                  <Button w="full" mr={1} size="sm" rightIcon={<FiChevronDown />} onClick={() => setIsModalOpen(true)} isDisabled={!isLoggedIn}>
                    DAI
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
                <Input value={outputAmount} isDisabled />
                <InputRightAddon fontSize="sm" fontWeight="bold">
                  DAI
                </InputRightAddon>
              </InputGroup>
            </FormControl>
            <Button colorScheme="messenger" isDisabled={!isLoggedIn}>
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
            <Stack spacing={0}>{tokens.wallet}</Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

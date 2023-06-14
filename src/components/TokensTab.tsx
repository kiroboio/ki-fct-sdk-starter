import {
  useDisclosure,
  Alert,
  Avatar,
  AlertTitle,
  AlertDescription,
  Stack,
  Card,
  CardBody,
  HStack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Heading,
  ModalBody,
  FormControl,
  Input,
  Divider,
  Button,
  ModalFooter,
  Text,
} from '@chakra-ui/react'
import { service } from '@kiroboio/fct-sdk'
import { Icon } from '@iconify/react'
import { useState } from 'react'

type TokenProps = {
  symbol: string
  amount: string
  logo: string
  name: string
  price: {
    usd: number
    protocol: string
  }
}

const formatValue = (value: string) => {
  if (value.slice(-1) === '.' && !value.slice(0, -2).includes('.')) return value

  const numericValue = value.replace(/[^0-9.]/g, '')
  const parts = numericValue.split('.')
  const integerPart = parts[0]
  const decimalPart = parts[1] ? parts[1].slice(0, 2) : ''

  let formattedValue = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  if (decimalPart !== '') {
    formattedValue += '.' + decimalPart
  }
  return formattedValue
}

const unFormatValue = (value: string) => {
  return typeof value === 'number' ? value : +value.replace(/,/g, '')
}

const TokensTab = (props: { tokens: any; isWallet: boolean }) => {
  const { tokens, isWallet } = props
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedToken, setSelectedToken] = useState<any>('')
  const [maxAmount, setMaxAmount] = useState('')
  const [amount, setAmount] = useState('')

  const handleInputChange = (e: { target: { value: any } }) => {
    const { value } = e.target

    if (unFormatValue(value) > unFormatValue(selectedToken.amount)) {
      setAmount(selectedToken.amount)
      return
    }

    setAmount(formatValue(value))
  }

  const handleTransfer = async () => {
    if (isWallet) {
      await service.wallet.transfer.execute('transfer', {
        to: service.vault.data.raw.value.address,
        amount: unFormatValue(amount) + '0'.repeat(18),
        token: tokens.raw.value.find((obj: { symbol: string }) => obj.symbol === selectedToken.symbol).token_address || '',
      })
    } else {
      await service.vault.transfer.execute('transfer', {
        to: service.wallet.data.raw.value.address,
        amount: unFormatValue(amount) + '0'.repeat(18),
        token: tokens.raw.value.find((obj: { symbol: string }) => obj.symbol === selectedToken.symbol).token_address || '',
      })
    }
  }

  return (
    <>
      {tokens.fmt.value.length === 0 && (
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
          {tokens.fmt.value.map((token: TokenProps, index: number) => (
            <Card key={index} size="sm" variant="outline" rounded="md" shadow="sm">
              <CardBody px={5}>
                <HStack justify="space-between">
                  <HStack>
                    <Avatar size="xs" src={token.logo} />
                    <Stack spacing={-1}>
                      <Text fontWeight="bold">{token.symbol}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {token.name}
                      </Text>
                    </Stack>
                  </HStack>
                  <HStack spacing={4}>
                    <Stack spacing={-1} textAlign="right">
                      <Text fontWeight="bold">{token.amount}</Text>
                      <Text fontSize="sm" color="gray.500">
                        ${formatValue(`${token.price.usd * unFormatValue(token.amount)}`)}
                      </Text>
                    </Stack>
                    <IconButton
                      size="sm"
                      rounded="full"
                      aria-label="Send"
                      icon={<Icon icon="akar-icons:arrow-right" />}
                      onClick={() => {
                        setSelectedToken(token)
                        setMaxAmount(token.amount)
                        onOpen()
                      }}
                    />
                  </HStack>
                </HStack>
              </CardBody>
            </Card>
          ))}
        </Stack>
      )}
      <Modal
        size="xs"
        isOpen={isOpen}
        onClose={() => {
          setAmount('')
          onClose()
        }}
        isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Stack spacing={1}>
              <Heading fontSize="xl">Send from {isWallet ? 'Connected Wallet' : 'Smart Wallet'}</Heading>
              <Text fontSize="md" color="gray.500">
                Balance:{' '}
                <Text as="span" fontWeight="extrabold">
                  {selectedToken?.amount} {selectedToken?.symbol}
                </Text>
              </Text>
            </Stack>
          </ModalHeader>
          <ModalBody>
            <FormControl textAlign="center" px={6}>
              <Input
                variant="unstyled"
                textAlign="center"
                fontSize="5xl"
                placeholder="0.00"
                value={amount}
                onChange={handleInputChange}
                autoComplete="off"
              />
              <Divider mb={3} />
              <Text my={3}>{selectedToken.price && <>${formatValue((unFormatValue(amount) * selectedToken.price.usd).toFixed(2))}</>}</Text>
              <Button variant="outline" size="xs" onClick={() => setAmount(maxAmount)}>
                Max
              </Button>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button w="full" colorScheme="messenger" onClick={handleTransfer}>
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default TokensTab

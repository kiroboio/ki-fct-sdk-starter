import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Stack,
  Heading,
  ModalCloseButton,
  ModalBody,
  FormControl,
  Input,
  Divider,
  Button,
  Checkbox,
  InputGroup,
  InputLeftElement,
  ModalFooter,
  Text,
} from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import { service } from '@kiroboio/fct-sdk'
import { useState } from 'react'

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

const TransferModal = (props: { isOpen: any; onClose: any; tokens: any; isWallet: any; selectedToken: any }) => {
  const { isOpen, onClose, tokens, isWallet, selectedToken } = props

  const [amount, setAmount] = useState('')
  const [transferTo, setTransferTo] = useState('')
  const [moveToWallet, setMoveToWallet] = useState(false)

  const handleModalClose = () => {
    setAmount('')
    setTransferTo('')
    onClose()
  }

  const handleTransfer = async () => {
    if (isWallet) {
      await service.wallet.transfer
        .execute('transfer', {
          to: transferTo,
          amount: unFormatValue(amount) + '0'.repeat(18),
          token: tokens.raw.value.find((obj: { symbol: string }) => obj.symbol === selectedToken.symbol).token_address || '',
        })
        .then((res: any) => {
          onClose()
        })
    } else {
      await service.vault.transfer
        .execute('transfer', {
          to: transferTo,
          amount: unFormatValue(amount) + '0'.repeat(18),
          token: tokens.raw.value.find((obj: { symbol: string }) => obj.symbol === selectedToken.symbol).token_address || '',
        })
        .then((res: any) => {
          onClose()
        })
    }
  }

  const handleInputChange = (e: { target: { value: any } }) => {
    const { value } = e.target

    if (unFormatValue(value) > unFormatValue(selectedToken.amount)) {
      setAmount(selectedToken.amount)
      return
    }

    setAmount(formatValue(value))
  }

  const handleSelectWallet = (e: any) => {
    e.target.checked
      ? isWallet
        ? setTransferTo(service.vault.data.raw.value.address)
        : setTransferTo(service.wallet.data.raw.value.address)
      : setTransferTo('')
    setMoveToWallet(e.target.checked)
  }

  return (
    <Modal size="sm" isOpen={isOpen} onClose={handleModalClose} isCentered>
      <ModalOverlay />
      <ModalContent p={4}>
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
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={5}>
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
              <Button variant="outline" size="xs" onClick={() => setAmount(selectedToken.amount)}>
                Max
              </Button>
            </FormControl>
            <FormControl>
              <Checkbox onChange={handleSelectWallet}>{isWallet ? 'Move to Smart Wallet' : 'Move to Connected Wallet'}</Checkbox>
              <InputGroup mt={3}>
                <InputLeftElement pointerEvents="none">
                  <Icon icon={isWallet && moveToWallet ? 'fluent:brain-circuit-20-filled' : 'fluent:wallet-32-filled'} />
                </InputLeftElement>
                <Input
                  placeholder="Enter Ethereum address"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  readOnly={moveToWallet}
                />
              </InputGroup>
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button w="full" colorScheme="messenger" onClick={handleTransfer}>
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default TransferModal

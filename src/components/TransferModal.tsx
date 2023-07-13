import {
  Text,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  Divider,
  Input,
  Checkbox,
  Box,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
  ButtonGroup,
} from '@chakra-ui/react'

import { service, useComputed } from '@kiroboio/fct-sdk'
import { memo, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { unFormatValue, pack, unpack } from '../utils/format'

const TransferModal = ({ isOpen, onClose, id, isWallet }: { isOpen: any; onClose: any; id: string; isWallet: boolean }) => {
  const [transferWalletAddress, setTransferWalletAddress] = useState('')
  const [transferAmount, setTransferAmount] = useState<any>(0)
  const [transferPrice, setTransferPrice] = useState<any>(0)
  const [error, setError] = useState('')
  const [isSending, setIsSending] = useState(false)

  const tokens = isWallet ? service.tokens.wallet.data.raw.map : service.tokens.vault.data.raw.map
  const tokensFmt = isWallet ? service.tokens.wallet.data.fmt.map : service.tokens.vault.data.fmt.map
  const symbol = useComputed(() => tokens.value[id]?.symbol)
  const amount = useComputed(() => tokens.value[id]?.amount)
  const amountFmt = useComputed(() => tokensFmt.value[id]?.amount)
  const price = useComputed(() => tokens.value[id]?.price.usd)
  const tokenAddress = useComputed(() => tokens.value[id]?.token_address)

  const isError = transferWalletAddress === '' || unFormatValue(transferAmount) > unFormatValue(amountFmt.value) || unFormatValue(transferAmount) <= 0

  const handleModalClose = () => {
    setTransferWalletAddress('')
    setTransferAmount('')
    setTransferPrice('')
    setError('')
    setIsSending(false)
    onClose()
  }

  const handleSelectWallet = (e: any) => {
    e.target.checked
      ? isWallet
        ? setTransferWalletAddress(service.vault.data.raw.value.address)
        : setTransferWalletAddress(service.wallet.data.raw.value.address)
      : setTransferWalletAddress('')
  }

  const handleSetMaxBalance = () => {
    setTransferAmount(unFormatValue(amountFmt.value))
    setTransferPrice(unFormatValue(amountFmt.value) * unFormatValue(price.value))
  }

  const handleTransfer = async () => {
    console.log(transferAmount, transferWalletAddress, tokenAddress.value)

    setError('')
    setIsSending(true)

    if (isWallet) {
      await service.wallet.erc20.transfer
        .execute('transfer', {
          contract: tokenAddress.peek() || '',
          inputs: {
            to: transferWalletAddress as `0x${string}`,
            amount: BigInt(transferAmount + '0'.repeat(18)),
          },
        })
        .then((res: any) => {
          console.log(res)
          if (res.results) {
            handleModalClose()
          } else {
            setError(res.error.message)
          }
          setIsSending(false)
        })
    } else {
      await service.vault.erc20.transfer
        .execute('transfer', [
          {
            contract: tokenAddress.peek() || '',
            inputs: {
              to: transferWalletAddress as `0x${string}`,
              amount: BigInt(transferAmount + '0'.repeat(18)),
            },
          },
        ])
        .then((res: any) => {
          console.log(res)
          if (res.results) {
            handleModalClose()
          } else {
            setIsSending(false)
            setError(res.error.message)
          }
        })
    }
  }

  const handleTransferAmountChange = (value: any) => {
    setTransferAmount(value)
    setTransferPrice(unFormatValue(value) * price.value)
  }

  const handleTransferPriceChange = (value: any) => {
    setTransferPrice(value)
    setTransferAmount(unFormatValue(value) / unFormatValue(price.value))
  }

  return (
    <Modal size="sm" isOpen={isOpen} onClose={handleModalClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          Transfer <>{symbol}</>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            From: <Text as="strong">{isWallet ? 'Connected Wallet' : 'Smart Wallet'}</Text>
          </Text>
          <Text>
            Balance:{' '}
            <Text as="strong">
              <>
                {amountFmt} {symbol}
              </>
            </Text>
          </Text>
          <FormControl mt={4}>
            <Stack spacing={5}>
              <Stack spacing={2}>
                <NumericFormat
                  variant="unstyled"
                  value={transferAmount}
                  placeholder="0.0"
                  textAlign="center"
                  fontSize="3xl"
                  autoComplete="off"
                  customInput={Input}
                  isDisabled={isSending}
                  onChange={(e) => handleTransferAmountChange(e.target.value)}
                  thousandSeparator
                />
                ;
                <Divider />
                <NumericFormat
                  prefix="$"
                  variant="unstyled"
                  placeholder="0.0"
                  textAlign="center"
                  fontSize="3xl"
                  autoComplete="off"
                  value={transferPrice}
                  customInput={Input}
                  isDisabled={isSending}
                  onChange={(e) => handleTransferPriceChange(e.target.value)}
                  thousandSeparator
                />
                ;
                <Box textAlign="center">
                  <ButtonGroup>
                    <Button isDisabled={isSending} size="sm" onClick={handleSetMaxBalance}>
                      Max
                    </Button>
                  </ButtonGroup>
                </Box>
              </Stack>
              <Stack spacing={2}>
                <Checkbox disabled={isSending} onChange={handleSelectWallet}>
                  Move to your {isWallet ? 'smart wallet' : 'connected wallet'}
                </Checkbox>
                <Input
                  disabled={isSending}
                  placeholder="Ethereum Address"
                  value={transferWalletAddress}
                  onChange={(e) => setTransferWalletAddress(e.target.value)}
                />
              </Stack>
            </Stack>
          </FormControl>
          {error && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              <AlertDescription maxWidth="sm">{error}</AlertDescription>
              <CloseButton position="absolute" right="8px" top="8px" onClick={() => setError('')} />
            </Alert>
          )}
        </ModalBody>

        <ModalFooter>
          <Button w="full" colorScheme="blue" isDisabled={isError} onClick={handleTransfer} isLoading={isSending}>
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default TransferModal

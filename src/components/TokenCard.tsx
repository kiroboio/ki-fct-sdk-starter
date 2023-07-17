import { Card, CardBody, HStack, Stack, IconButton, Avatar, Text, useDisclosure, Button } from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import { service, useComputed } from '@kiroboio/fct-sdk'
import { memo } from 'react'

import TransferModal from './TransferModal'

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

const TokenCard = ({ id, isWallet }: { id: string; isWallet: boolean }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const tokens = isWallet ? service.tokens.wallet.data.fmt.map : service.tokens.vault.data.fmt.map
  const name = useComputed(() => tokens.value[id]?.name)
  const amount = useComputed(() => tokens.value[id]?.amount)
  const price = useComputed(() => tokens.value[id]?.price.usd)
  const total = useComputed(() => +amount.value * +price.value)
  const logoURL = useComputed(() => tokens.value[id]?.logo)
  const symbol = useComputed(() => tokens.value[id]?.symbol)

  return (
    <Card size="sm" variant="outline" rounded="md" shadow="sm">
      <CardBody px={5}>
        <HStack justify="space-between">
          <HStack>
            <Avatar size="xs" src={logoURL.value || ''} />
            <Stack spacing={-1}>
              <Text fontWeight="bold">
                <>{symbol}</>
              </Text>
              <Text fontSize="sm" color="gray.500">
                <>{name}</>
              </Text>
            </Stack>
          </HStack>
          <HStack spacing={4}>
            <Stack spacing={-1} textAlign="right">
              <Text fontWeight="bold">
                <>{amount}</>
              </Text>
              <Text fontSize="sm" color="gray.500">
                ${formatValue(`${+price * unFormatValue(amount.value)}`)}
              </Text>
            </Stack>
            <IconButton size="sm" rounded="full" aria-label="Send" icon={<Icon icon="akar-icons:arrow-right" />} onClick={onOpen} />
          </HStack>
        </HStack>
        <TransferModal isOpen={isOpen} onClose={onClose} id={id} isWallet={isWallet} />
      </CardBody>
    </Card>
  )
}

const MemoTokenCard = memo(TokenCard)

export default MemoTokenCard
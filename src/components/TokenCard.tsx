import { Card, CardBody, HStack, Stack, IconButton, Avatar, Text } from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import { service, useComputed } from '@kiroboio/fct-sdk'
import { memo } from 'react'

type TokenProps = {
  // symbol: string
  // amount: string
  // logo: string
  // name: string
  // price: {
  //   usd: number
  //   protocol: string
  // }
  id: string
  isWallet: boolean
  handleOpenModal: any
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

const TokenCard = (props: TokenProps) => {
  const { id, isWallet, handleOpenModal } = props
  const tokens = isWallet ? service.tokens.wallet.data.fmt.map : service.tokens.vault.data.fmt.map
  const amount = useComputed(() => tokens.value[id]?.amount)
  const name = useComputed(() => tokens.value[id]?.name)
  const symbol = useComputed(() => tokens.value[id]?.symbol)
  const price = useComputed(() => tokens.value[id]?.price.usd)
  const logoURL = useComputed(() => tokens.value[id]?.logo)
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
            <IconButton size="sm" rounded="full" aria-label="Send" icon={<Icon icon="akar-icons:arrow-right" />} onClick={handleOpenModal} />
          </HStack>
        </HStack>
      </CardBody>
    </Card>
  )
}

const MemoTokenCard = memo(TokenCard)

export default MemoTokenCard

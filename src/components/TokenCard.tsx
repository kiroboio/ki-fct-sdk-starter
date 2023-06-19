import { Card, CardBody, HStack, Stack, IconButton, Avatar, Text } from '@chakra-ui/react'
import { Icon } from '@iconify/react'

type TokenProps = {
  symbol: string
  amount: string
  logo: string
  name: string
  price: {
    usd: number
    protocol: string
  }
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
  const { symbol, amount, logo, name, price, handleOpenModal } = props
  return (
    <Card size="sm" variant="outline" rounded="md" shadow="sm">
      <CardBody px={5}>
        <HStack justify="space-between">
          <HStack>
            <Avatar size="xs" src={logo} />
            <Stack spacing={-1}>
              <Text fontWeight="bold">{symbol}</Text>
              <Text fontSize="sm" color="gray.500">
                {name}
              </Text>
            </Stack>
          </HStack>
          <HStack spacing={4}>
            <Stack spacing={-1} textAlign="right">
              <Text fontWeight="bold">{amount}</Text>
              <Text fontSize="sm" color="gray.500">
                ${formatValue(`${price.usd * unFormatValue(amount)}`)}
              </Text>
            </Stack>
            <IconButton size="sm" rounded="full" aria-label="Send" icon={<Icon icon="akar-icons:arrow-right" />} onClick={handleOpenModal} />
          </HStack>
        </HStack>
      </CardBody>
    </Card>
  )
}

export default TokenCard

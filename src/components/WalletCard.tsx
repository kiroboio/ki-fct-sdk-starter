import { CheckIcon, CopyIcon } from '@chakra-ui/icons'
import { useClipboard, Card, CardBody, HStack, IconButton, Text } from '@chakra-ui/react'
import { Icon } from '@iconify/react'

type WalletProps = {
  title: string
  address: any
  balance: any
  icon: string
  isSelect?: boolean
  onClick?: any
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

const WalletCard = (props: WalletProps) => {
  const { isSelect, onClick, title, address, balance, icon } = props
  const { onCopy, hasCopied } = useClipboard(address.raw)
  return (
    <Card
      w="full"
      variant={isSelect ? 'outline' : 'solid'}
      borderColor={isSelect ? 'messenger.500' : 'blackAlpha.200'}
      opacity={isSelect ? 1 : 0.35}
      borderWidth={3}
      onClick={onClick}
      cursor="pointer">
      <CardBody>
        <Text fontSize="md" fontWeight="bold">
          {title}
        </Text>
        <HStack spacing={1}>
          <Text fontSize="sm" color="gray.500">
            <>{address.fmt}</>
          </Text>
          <IconButton size="xs" rounded="full" aria-label="Copy Address" icon={hasCopied ? <CheckIcon /> : <CopyIcon />} onClick={onCopy} />
        </HStack>
        <HStack mt={3}>
          <Icon icon={icon} width="24px" height="24px" />
          <Text fontWeight="extrabold">${formatValue(balance)}</Text>
        </HStack>
      </CardBody>
    </Card>
  )
}

export default WalletCard

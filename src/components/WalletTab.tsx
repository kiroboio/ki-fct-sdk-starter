import { Text, Card, CardBody, HStack, useTab, IconButton, useClipboard } from '@chakra-ui/react'
import { CheckIcon, CopyIcon } from '@chakra-ui/icons'
import { Icon } from '@iconify/react'
import { service, useComputed } from '@kiroboio/fct-sdk'
import { forwardRef } from 'react'

interface WalletTabProps {
  id: string
}

const WalletTab = forwardRef(({ id, ...props }: WalletTabProps, ref) => {
  const tabProps = useTab({ ...props })
  const isSelected = !!tabProps['aria-selected']
  const isWallet = id === 'wallet'

  const vault = {
    address: {
      fmt: useComputed(() => service.vault.data.fmt.value.address),
      raw: useComputed(() => service.vault.data.raw.value.address),
    },
    balance: {
      fmt: useComputed(() =>
        service.tokens.vault.data.fmt.list.value
          .reduce((prev, current) => prev + +current.price.usd * +current.amount.replace(/,/g, ''), 0)
          .toFixed(2)
      ),
      raw: useComputed(() => service.tokens.vault.data.raw.list.value.reduce((prev, current) => prev + +current.price.usd * +current.amount, 0)),
    },
  }

  const wallet = {
    address: {
      fmt: useComputed(() => service.wallet.data.fmt.value.address),
      raw: useComputed(() => service.wallet.data.raw.value.address),
    },
    balance: {
      fmt: useComputed(() =>
        service.tokens.wallet.data.fmt.list.value
          .reduce((prev, current) => prev + +current.price.usd * +current.amount.replace(/,/g, ''), 0)
          .toFixed(2)
      ),
      raw: useComputed(() => service.tokens.wallet.data.raw.list.value.reduce((prev, current) => prev + +current.price.usd * +current.amount, 0)),
    },
  }

  const { onCopy, hasCopied } = useClipboard(isWallet ? wallet.address.raw.value : vault.address.raw.value)

  return (
    <Card
      w="full"
      variant={isSelected ? 'outline' : 'solid'}
      borderColor={isSelected ? 'messenger.500' : 'blackAlpha.200'}
      opacity={isSelected ? 1 : 0.35}
      borderWidth={3}
      cursor="pointer"
      {...tabProps}>
      <CardBody>
        <Text fontSize="md" fontWeight="bold">
          {isWallet ? 'Connected Wallet' : 'Smart Wallet'}
        </Text>
        <HStack spacing={1}>
          <Text fontSize="sm" color="gray.500">
            {isWallet ? <>{wallet.address.fmt}</> : <>{vault.address.fmt}</>}
          </Text>
          <IconButton size="xs" rounded="full" aria-label="Copy Address" icon={hasCopied ? <CheckIcon /> : <CopyIcon />} onClick={onCopy} />
        </HStack>
        <HStack mt={3}>
          <Icon icon={isWallet ? 'fluent:wallet-32-filled' : 'fluent:brain-circuit-20-filled'} width="24px" height="24px" />
          <Text fontWeight="extrabold" fontSize="xl">
            ${isWallet ? <>{wallet.balance.fmt}</> : <>{vault.balance.fmt}</>}
          </Text>
        </HStack>
      </CardBody>
    </Card>
  )
})

WalletTab.displayName = 'WalletTab'

export default WalletTab

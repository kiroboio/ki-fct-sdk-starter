import { Text, Card, CardBody, HStack, useTab, IconButton, useClipboard } from '@chakra-ui/react'
import { CheckIcon, CopyIcon } from '@chakra-ui/icons'
import { Icon } from '@iconify/react'
import { service, useComputed } from '@kiroboio/fct-sdk'
import { forwardRef, useState } from 'react'

const WalletTab = forwardRef((props, ref) => {
  const tabProps = useTab({ ...props })
  const isSelected = !!tabProps['aria-selected']
  const isWallet = tabProps.tabIndex === 1

  const smartWallet = {
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

  const connectedWallet = {
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

  const { onCopy, hasCopied } = useClipboard(isWallet ? connectedWallet.address.raw.value : smartWallet.address.raw.value)

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
            {isWallet ? connectedWallet.address.fmt.value : smartWallet.address.fmt.value}
          </Text>
          <IconButton size="xs" rounded="full" aria-label="Copy Address" icon={hasCopied ? <CheckIcon /> : <CopyIcon />} onClick={onCopy} />
        </HStack>
        <HStack mt={3}>
          <Icon icon="fluent:wallet-32-filled" width="24px" height="24px" />
          <Text fontWeight="extrabold" fontSize="xl">
            ${isWallet ? connectedWallet.balance.fmt.value : smartWallet.balance.fmt.value}
          </Text>
        </HStack>
      </CardBody>
    </Card>
  )
})

WalletTab.displayName = 'WalletTab'

export default WalletTab

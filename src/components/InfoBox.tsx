import { Icon } from '@iconify/react'
import { ButtonGroup, HStack, Button, IconButton } from '@chakra-ui/react'
import { service, useTokens, useFlowPower } from '@kiroboio/fct-sdk'

export default function InfoBox() {
  const fuel = useFlowPower()
  const vTokens = useTokens({ account: 'vault' })
  const wTokens = useTokens({ account: 'wallet' })

  const wTotalUsd = service.formatting.prebuild.formatValue({
    service: 'tokens',
    name: 'total',
    value: wTokens.list.reduce((acc, cur) => acc + +cur.raw.balanceUsd, 0),
    decimals: 0,
    digits: 2,
  })
  const vTotalUsd = service.formatting.prebuild.formatValue({
    service: 'tokens',
    name: 'total',
    value: vTokens.list.reduce((acc, cur) => acc + +cur.raw.balanceUsd, 0),
    decimals: 0,
    digits: 2,
  })

  return (
    <ButtonGroup spacing={1} size="sm" w="full" justifyContent="space-between" colorScheme="telegram">
      <HStack>
        <Button leftIcon={<Icon icon="streamline:money-safe-vault-saving-combo-payment-safe-money-combination-finance" />}>${vTotalUsd}</Button>
        <Button leftIcon={<Icon icon="streamline:money-wallet-money-payment-finance-wallet" />}>${wTotalUsd}</Button>
        <Button leftIcon={<Icon icon="streamline:image-flash-2-flash-power-connect-charge-electricity-lightning" />}>
          {fuel.fmt.balance.native} ETH
        </Button>
      </HStack>
      <IconButton aria-label="Settings" icon={<Icon icon="streamline:interface-setting-cog-work-loading-cog-gear-settings-machine" />} />
    </ButtonGroup>
  )
}

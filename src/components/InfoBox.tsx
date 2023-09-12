import { Icon } from '@iconify/react'
import {
  ButtonGroup,
  HStack,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from '@chakra-ui/react'

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
    <ButtonGroup spacing={1} justifyContent="space-between" colorScheme="gray">
      <HStack>
        <Popover>
          <PopoverTrigger>
            <Button rounded="xl" leftIcon={<Icon icon="streamline:money-safe-vault-saving-combo-payment-safe-money-combination-finance" />}>
              ${vTotalUsd}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Add!</PopoverHeader>
            <PopoverBody>Are you sure you want to have that milkshake?</PopoverBody>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger>
            <Button rounded="xl" leftIcon={<Icon icon="streamline:money-wallet-money-payment-finance-wallet" />}>
              ${wTotalUsd}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Confirmation!</PopoverHeader>
            <PopoverBody>Are you sure you want to have that milkshake?</PopoverBody>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger>
            <Button rounded="xl" leftIcon={<Icon icon="streamline:image-flash-2-flash-power-connect-charge-electricity-lightning" />}>
              {fuel.fmt.balance.native} ETH
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Add Flow Power</PopoverHeader>
            <PopoverBody>Are you sure you want to have that milkshake?</PopoverBody>
          </PopoverContent>
        </Popover>
      </HStack>
    </ButtonGroup>
  )
}

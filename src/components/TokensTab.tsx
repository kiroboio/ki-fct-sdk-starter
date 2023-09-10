import { Box, Tabs, TabList, TabPanels, Tab, TabPanel, Center, StackProps } from '@chakra-ui/react'
import { useTokens, useTokenActions } from '@kiroboio/fct-sdk'
import { memo, forwardRef } from 'react'

interface TokenPickerItemProps extends StackProps {
  highlight?: boolean
  account: 'vault' | 'wallet'
  token: ReturnType<typeof useTokens>['list']['0']
}

const Token = memo(
  forwardRef<HTMLDivElement, TokenPickerItemProps>(({ token, highlight, account, ...props }, ref) => {
    return (
      <Box ref={ref} {...props}>
        {token.raw.symbol}
      </Box>
    )
  })
)

export default function TokensTab() {
  const vTokens = useTokens({ account: 'vault' })
  const wTokens = useTokens({ account: 'wallet' })

  const tokens = {
    wallet: (
      <>
        {wTokens.isLoading ? <Center>Loading...</Center> : wTokens.list.map((token) => <Token token={token} key={token.raw.id} account={'wallet'} />)}
      </>
    ),
    vault: (
      <>
        {vTokens.isLoading ? <Center>Loading...</Center> : vTokens.list.map((token) => <Token token={token} key={token.raw.id} account={'vault'} />)}
      </>
    ),
  }

  return (
    <Tabs isFitted>
      <TabList>
        <Tab>Vault</Tab>
        <Tab>Wallet</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>{tokens.vault}</TabPanel>
        <TabPanel>{tokens.wallet}</TabPanel>
      </TabPanels>
    </Tabs>
  )
}

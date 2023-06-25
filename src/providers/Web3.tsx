import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { ETH_CHAINS, SITE_NAME } from 'utils/config'
import { useColorMode } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const { publicClient, webSocketPublicClient } = configureChains(ETH_CHAINS, [publicProvider()])

const config = createConfig(
  getDefaultConfig({
    appName: SITE_NAME,
    autoConnect: true,
    chains: ETH_CHAINS,
    walletConnectProjectId: '',
    publicClient,
    webSocketPublicClient,
  })
)

export function Web3Provider(props: Props) {
  const { colorMode } = useColorMode()

  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider options={{ initialChainId: 5 }} mode={colorMode}>
        {props.children}
      </ConnectKitProvider>
    </WagmiConfig>
  )
}

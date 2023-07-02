import type { AppProps } from 'next/app'
import { Layout } from 'components/layout'
import { Web3Provider } from 'providers/Web3'
import { ChakraProvider } from 'providers/Chakra'
import { useIsMounted } from 'hooks/useIsMounted'
import { Seo } from 'components/layout/Seo'

import { service } from '@kiroboio/fct-sdk'
import { watchWalletClient } from '@wagmi/core'
import { providers } from 'ethers'

function serviceInit() {
  service.start({
    url: 'https://testapi.kirobo.me',
    key: 'kirobo',
    secret: 'kirobodev',
  })

  watchWalletClient({}, async (client) => {
    const transport = client?.transport
    const chainId = await client?.getChainId()
    const address = client?.account.address
    const signer = transport && chainId && address ? new providers.Web3Provider(transport, chainId).getSigner(address) : null

    service.config({
      signer: signer,
      autoLogin: false,
    })
  })
}

if (typeof window !== 'undefined') {
  serviceInit()
}

export default function App({ Component, pageProps }: AppProps) {
  const isMounted = useIsMounted()

  return (
    <ChakraProvider>
      <Seo />
      <Web3Provider>
        {isMounted && (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </Web3Provider>
    </ChakraProvider>
  )
}

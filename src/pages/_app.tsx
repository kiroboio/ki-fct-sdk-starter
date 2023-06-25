import type { AppProps } from 'next/app'
import { Layout } from 'components/layout'
import { Web3Provider } from 'providers/Web3'
import { ChakraProvider } from 'providers/Chakra'
import { useIsMounted } from 'hooks/useIsMounted'
import { Seo } from 'components/layout/Seo'

import { service } from '@kiroboio/fct-sdk'
import { watchWalletClient } from '@wagmi/core'

function serviceInit() {
  service.start({})

  watchWalletClient({}, (walletClient) => {
    service.config({
      signer: walletClient,
      autoLogin: false,
    })
  })
  // service.formatting.setValueFormatter((params) => {
  //   let result = service.formatting.prebuild.formatValue({ ...params, digits: 4 })
  //   if (result.endsWith('.0')) {
  //     result = result.slice(0, -2)
  //   }
  //   return result
  // })
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

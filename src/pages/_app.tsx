import type { AppProps } from 'next/app'
import { Layout } from 'components/layout'
import { Web3Provider } from 'providers/Web3'
import { ChakraProvider } from 'providers/Chakra'
import { TokenProvider } from 'providers/Token'
import { useIsMounted } from 'hooks/useIsMounted'
import { Seo } from 'components/layout/Seo'

import { service } from '@kiroboio/fct-sdk'
import { watchSigner } from '@wagmi/core'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const isMounted = useIsMounted()

  const serviceInit = () => {
    service.start({})

    watchSigner({}, (signer) => {
      service.config({
        signer,
        autoLogin: false,
      })
    })
  }

  useEffect(() => {
    serviceInit()
  }, [])

  return (
    <ChakraProvider>
      <Seo />
      <Web3Provider>
        <TokenProvider>
          {isMounted && (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </TokenProvider>
      </Web3Provider>
    </ChakraProvider>
  )
}

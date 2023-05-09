import type { AppProps } from 'next/app'
import { Layout } from 'components/layout'
import { Web3Provider } from 'providers/Web3'
import { ChakraProvider } from 'providers/Chakra'
import { useIsMounted } from 'hooks/useIsMounted'
import { Seo } from 'components/layout/Seo'
import { service } from '@kiroboio/fct-sdk'
import { watchSigner } from '@wagmi/core'
import { KI_KEY, KI_SECRET } from 'utils/config'

function serviceInit() {
  service.start({
    key: KI_KEY,
    secret: KI_SECRET,
  })

  watchSigner({}, (signer) => {
    service.config({ signer, autoLogin: false })
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

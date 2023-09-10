import type { AppProps } from 'next/app'
import { Layout } from 'components/layout'
import { Web3Provider } from 'providers/Web3'
import { ChakraProvider } from 'providers/Chakra'
import { useIsMounted } from 'hooks/useIsMounted'
import { Seo } from 'components/layout/Seo'
import { service, providers } from '@kiroboio/fct-sdk'
import { watchWalletClient } from '@wagmi/core'

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

  service.formatting.setValueFormatter((params) => {
    let result = service.formatting.prebuild.formatValue({
      ...params,
      // format: '0,.00',
    })
    if (result.endsWith('.0')) {
      result = result.slice(0, -2)
    }
    return result
  })

  service.formatting.setAddressFormatter((params) => {
    if (params.service === 'tokens') {
      service.formatting.prebuild.formatAddress({ ...params, icap: true })
      return params.address.toLowerCase()
    }
    return service.formatting.prebuild.formatAddress(params)
  })

  service.formatting.setDateTimeFormatter((params) => {
    if (params.service === 'fct/active') {
      if (params.name === 'expires_at' || params.name === 'vaild_from') {
        return service.formatting.prebuild.formatDateTime({ ...params, relative: false })
      }
    }
    if (params.service === 'fct/drafts') {
      if (params.name === 'updatedAt') {
        return service.formatting.prebuild.formatDateTime({ ...params, relative: true })
      }
    }
    return service.formatting.prebuild.formatDateTime(params)
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

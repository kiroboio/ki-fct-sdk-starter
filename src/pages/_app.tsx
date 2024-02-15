import type { AppProps } from 'next/app'
import { Layout } from 'components/layout'
import { Web3Provider } from 'providers/Web3'
import { ChakraProvider } from 'providers/Chakra'
import { useIsMounted } from 'hooks/useIsMounted'
import { Seo } from 'components/layout/Seo'
import { service, providers } from '@kiroboio/fct-sdk'
import { getWalletClient, watchWalletClient } from '@wagmi/core'
import { useEffect } from 'react'

type Payload = {
  method: string
  params: Array<any>
}

class ServiceProvider extends providers.JsonRpcProvider {
  _action: (payload: Payload) => Promise<any>

  _chainId: number

  constructor(chainId: number) {
    super('ipc://service', chainId)
    this._action = async () => {}
    this._chainId = chainId
  }

  clone() {
    const copy = new ServiceProvider(this._chainId)
    copy.setAction(this._action)
    return copy
  }

  setAction(action: (payload: Payload) => Promise<any>) {
    this._action = action
  }

  send(method: string, params: Array<any>): Promise<any> {
    return this._action({ method, params })
  }
}

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
  if ((params.service === 'fct/active' && params.name === 'expires_at') || params.name === 'vaild_from') {
    return service.formatting.prebuild.formatDateTime({
      ...params,
      relative: false,
    })
  }
  if (params.service === 'fct/drafts' && params.name === 'updatedAt') {
    return service.formatting.prebuild.formatDateTime({
      ...params,
      relative: true,
    })
  }
  return service.formatting.prebuild.formatDateTime(params)
})

export default function App({ Component, pageProps }: AppProps) {
  const isMounted = useIsMounted()

  useEffect(() => {
    // console.log('init service!', window);
    const initiate = async () => {
      service.start({
        url: 'https://testapi.kirobo.me',
        key: 'kirobo',
        secret: 'kirobodev',
      })

      const config = async (
        client: {
          transport: any
          getChainId: () => any
          account: { address: any }
        } | null
      ) => {
        const transport = client?.transport
        const chainId = await client?.getChainId()
        const address = client?.account.address
        const signer = transport && chainId && address ? new providers.Web3Provider(transport, chainId).getSigner(address) : null

        const web3ProviderFactory = () => {
          return transport && chainId && address ? new providers.Web3Provider(transport, chainId) : null
        }

        service.config({
          signer,
          web3ProviderFactory,
          serviceProviderFactory: new ServiceProvider(chainId),
          autoLogin: true,
        })
      }

      const walletClient = await getWalletClient()
      if (walletClient) {
        config(walletClient)
      }
      watchWalletClient({}, config)
    }

    initiate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

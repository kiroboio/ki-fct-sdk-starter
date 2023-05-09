import { service, useComputed } from '@kiroboio/fct-sdk'

export default function GasPrice() {
  const price = useComputed(() => (+service.network.value.gasPrice / 1e9).toFixed(2) + ' gwei')
  return <>{price}</>
}

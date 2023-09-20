import { useNetwork, useVault, useWallet } from '@kiroboio/fct-sdk'

import { getBaseLink } from '../utils/chainIdMethods'

export const useBlockchainLink = () => {
  const network = useNetwork()
  const wallet = useWallet()
  const vault = useVault()

  const { chainId } = network.data.raw
  const walletAddress = wallet.data.raw.address
  const vaultAddress = vault.data.raw.address

  // console.log('chainId', {
  //   chainId,
  //   walletAddress,
  //   vaultAddress,
  // });

  const baseLink = getBaseLink(chainId.toString())

  const vaultLink = `${baseLink}/address/${vaultAddress}`
  const walletLink = `${baseLink}/address/${walletAddress}`

  const txLink = `${baseLink}/tx`
  const blockLink = `${baseLink}/block`
  const tokenLink = `${baseLink}/token`

  return { baseLink, vaultLink, walletLink, txLink, blockLink, tokenLink }
}

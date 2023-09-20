export const getBaseLink = (chainId: string) => {
  let baseLink = 'https://'
  if (chainId === '1') {
    baseLink += 'etherscan.io'
  } else if (chainId === '5') {
    baseLink += 'goerli.etherscan.io'
  } else if (chainId === '42161') {
    baseLink += 'arbiscan.io'
  } else if (chainId === '421613') {
    baseLink += 'goerli.arbiscan.io'
  } else {
    baseLink += 'www.kiroboflow.io/'
  }
  return baseLink
}

export const isChainIdSupportedNetwork = (chainId: string | number) => {
  let isSupported = false
  switch (chainId) {
    case '1':
      isSupported = true
      break
    case 1:
      isSupported = true
      break
    case '5':
      isSupported = true
      break
    case 5:
      isSupported = true
      break
    case '42161':
      isSupported = true
      break
    case 42161:
      isSupported = true
      break
    case '421613':
      isSupported = true
      break
    case 421613:
      isSupported = true
      break
    default:
      isSupported = false
      break
  }
  return isSupported
}

export const ethAddress0xE = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' as const
export const ethAddress0x0 = '0x0000000000000000000000000000000000000000' as const

export const shortenAddress = (address?: string | null, length = 4): string => {
  if (!address) return ''
  if (address.length < length * 2 + 5) return address

  const left = address.slice(0, length + 2)
  const right = address.slice(address.length - length)
  return `${left}...${right}`
}

export const isNative = (address: string) => {
  const native = '0x'.padEnd(42, '0')
  return [native, ethAddress0xE].includes(address)
}

export const convertNative = (address: string) => {
  return isNative(address) ? ethAddress0xE : address
}

export const isEqualAddresses = (address1: string, address2: string, convertNatives = false) => {
  try {
    if (convertNatives) {
      return convertNative(address1).toLowerCase() === convertNative(address2).toLowerCase()
    }
    return address1.toLowerCase() === address2.toLowerCase()
  } catch (error) {
    return false
  }
}

export const formatAddress = ({
  address,
  startSubstringLength,
  endSubstringLength,
}: {
  address: string
  startSubstringLength?: number
  endSubstringLength?: number
}) => {
  const startSubstring = startSubstringLength || 6
  const endSubstring = endSubstringLength || 4

  return `${address.substring(0, startSubstring)}...${address.substring(address.length - endSubstring, address.length)}`
}

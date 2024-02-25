import type { BigNumberish } from 'ethers'
import BigDecimal from 'bignumber.js'

export const weiToEther = (value?: BigNumberish, decimals = 18) => {
  if (!value) return undefined
  BigDecimal.config({
    DECIMAL_PLACES: decimals,
    ROUNDING_MODE: BigDecimal.ROUND_FLOOR,
  })
  try {
    const ethValue = new BigDecimal(value.toString()).div(new BigDecimal(`1${'0'.repeat(decimals)}`)).multipliedBy(new BigDecimal('1'))

    const decimalsPlaces = ethValue.decimalPlaces()
    if (decimalsPlaces && decimalsPlaces > 6 && ethValue.lt(new BigDecimal('0.000001'))) {
      // remove scientific notation eg:(1+18) for small numbers
      return ethValue.toFormat(decimals)
    }

    return ethValue.toString()
  } catch (e) {
    console.error({ ethValueError: e })
    return '0'
  }
}
export const etherToWei = (value: string, decimals = 18) => {
  BigDecimal.config({
    DECIMAL_PLACES: decimals,
    ROUNDING_MODE: BigDecimal.ROUND_FLOOR,
  })
  return new BigDecimal(value).multipliedBy(new BigDecimal(`1${'0'.repeat(decimals)}`)).toFixed(0)
}

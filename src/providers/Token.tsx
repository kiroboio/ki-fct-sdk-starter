//@ts-nocheck
import { useState, createContext } from 'react'

const TokenContext = createContext({
  inputToken: { symbol: 'WBTC', address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599' },
  outputToken: { symbol: 'LINK', address: '0x514910771af9ca656af840dff83e8264ecf986ca' },
  balance: 0,
  setInputToken: () => {},
  setOutputToken: () => {},
  setBalance: () => {},
})

const TokenProvider = ({ children }) => {
  const [inputToken, setInputToken] = useState({ symbol: 'WBTC', address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599' })
  const [outputToken, setOutputToken] = useState({ symbol: 'LINK', address: '0x514910771af9ca656af840dff83e8264ecf986ca' })
  const [balance, setBalance] = useState(0)

  return (
    <TokenContext.Provider value={{ inputToken, outputToken, balance, setInputToken, setOutputToken, setBalance }}>{children}</TokenContext.Provider>
  )
}

export { TokenProvider, TokenContext }

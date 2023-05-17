//@ts-nocheck
import { useState, createContext } from 'react'

const TokenContext = createContext({
  inputToken: 'WBTC',
  outputToken: 'LINK',
  balance: 0,
  setInputToken: () => {},
  setOutputToken: () => {},
  setBalance: () => {},
})

const TokenProvider = ({ children }) => {
  const [inputToken, setInputToken] = useState('WBTC')
  const [outputToken, setOutputToken] = useState('LINK')
  const [balance, setBalance] = useState(0)

  return (
    <TokenContext.Provider value={{ inputToken, outputToken, balance, setInputToken, setOutputToken, setBalance }}>{children}</TokenContext.Provider>
  )
}

export { TokenProvider, TokenContext }

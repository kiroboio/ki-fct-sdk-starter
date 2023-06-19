import { useDisclosure, Alert, AlertTitle, AlertDescription, Stack, Center } from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import { service, useComputed } from '@kiroboio/fct-sdk'
import { useState } from 'react'
import MemoTokenCard from './TokenCard'
import TransferModal from './TransferModal'

type TokenProps = {
  // symbol: string
  // amount: string
  // logo: string
  // name: string
  // price: {
  //   usd: number
  //   protocol: string
  // }
  id: string
  isWallet: boolean
  handleOpenModal: any
}
const pack = (list: Partial<{ id: string }>[]) => {
  return JSON.stringify(list.map((item) => item.id))
}

const unpack = (packed: string): string[] => JSON.parse(packed)

const TokensTab = (props: { isWallet: boolean }) => {
  const { isWallet } = props
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedToken, setSelectedToken] = useState('')

  const wIsLoading = useComputed(() => service.tokens.wallet.data.isLoading.value)
  const vIsLoading = useComputed(() => service.tokens.vault.data.isLoading.value)

  const wTokens = useComputed(() => pack(service.tokens.wallet.data.fmt.list.value))
  const vTokens = useComputed(() => pack(service.tokens.vault.data.fmt.list.value))

  const handleOpenModal = (token: any) => {
    setSelectedToken(token)
    onOpen()
  }

  const tokens = {
    wallet: useComputed(() => (
      <>
        {wIsLoading.value ? (
          <Center>Loading...</Center>
        ) : (
          unpack(wTokens.value).map((id) => <MemoTokenCard key={id} id={id} isWallet={true} handleOpenModal={() => handleOpenModal(id)} />)
        )}
      </>
    )),
    vault: useComputed(() => (
      <>
        {vIsLoading.value ? (
          <Center>Loading...</Center>
        ) : (
          unpack(vTokens.value).map((id) => <MemoTokenCard key={id} id={id} isWallet={false} handleOpenModal={() => handleOpenModal(id)} />)
        )}
      </>
    )),
  }

  return (
    <>
      {tokens && (
        <Stack spacing={1}>
          {isWallet && <>{tokens.wallet}</>}
          {!isWallet && <>{tokens.vault}</>}
          <TransferModal isOpen={isOpen} onClose={onClose} isWallet={isWallet} selectedTokenId={selectedToken} />
        </Stack>
      )}
    </>
  )
}

export default TokensTab

import { useDisclosure, Alert, AlertTitle, AlertDescription, Stack } from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import { useState } from 'react'
import TokenCard from './TokenCard'
import TransferModal from './TransferModal'

type TokenProps = {
  symbol: string
  amount: string
  logo: string
  name: string
  price: {
    usd: number
    protocol: string
  }
}
const TokensTab = (props: { tokens: any; isWallet: boolean }) => {
  const { tokens, isWallet } = props
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedToken, setSelectedToken] = useState('')

  const handleOpenModal = (token: any) => {
    setSelectedToken(token)
    onOpen()
  }

  return (
    <>
      {tokens.fmt.value.length === 0 && (
        <Alert
          status="info"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          rounded="lg"
          height="200px">
          <Icon icon="radix-icons:tokens" width="40px" height="40px" />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            No tokens yet
          </AlertTitle>
          <AlertDescription maxWidth="xs">Buy or transfer tokens to this wallet to get started.</AlertDescription>
        </Alert>
      )}
      {tokens && (
        <Stack spacing={1}>
          {tokens.fmt.value.map((token: TokenProps, index: number) => (
            <TokenCard key={index} handleOpenModal={() => handleOpenModal(token)} {...token} />
          ))}
          <TransferModal isOpen={isOpen} onClose={onClose} tokens={tokens} isWallet={isWallet} selectedToken={selectedToken} />
        </Stack>
      )}
    </>
  )
}

export default TokensTab

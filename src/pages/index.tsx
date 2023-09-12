import { Container, Heading, Text } from '@chakra-ui/react'
import { useVault } from '@kiroboio/fct-sdk'
import AccountContent from 'components/AccountContent'
import CreateVaultBox from 'components/CreateVaultBox'
import { Head } from 'components/layout/Head'
import { useState, useEffect } from 'react'
import { zeroAddress } from 'viem'

export default function Home() {
  const [hasVault, setHasVault] = useState(false)
  const { data: vault } = useVault()

  useEffect(() => {
    setHasVault(vault.raw.address !== zeroAddress)
  }, [vault.raw.address])
  return (
    <>
      <Head />
      <Container maxW="1200px" py={6}>
        {!hasVault ? <CreateVaultBox /> : <AccountContent />}
      </Container>
    </>
  )
}

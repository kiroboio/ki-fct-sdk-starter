import { Button, Heading, Stack, Text, useToast } from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import { service } from '@kiroboio/fct-sdk'
import { useState } from 'react'

export default function CreateVaultBox() {
  const toast = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const createVault = () => async () => {
    setIsCreating(true)
    try {
      const res = await service.wallet.vaultFactory.createVault.execute('createVault', {
        inputs: {},
      })
      toast({
        title: 'Vault created.',
        description: `We've created your vault for you. You can now use it to store your assets under the following address: ${res}`,
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    } catch (e) {
      toast({
        title: 'Something went wrong!',
        description: 'There was an error creating your vault. Please try again later.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
    setIsCreating(false)
  }
  return (
    <Stack w="full" h="full" justify="center" spacing={4} align="center" textAlign="center" p={12}>
      <Icon icon="streamline:money-safe-vault-saving-combo-payment-safe-money-combination-finance" width="48px" height="48px" />
      <Heading>Create Vault</Heading>
      <Text>Kirobo Liquid Vault keeps your assets backed-up and secured while using and accessing them on a daily basis</Text>
      <Button isLoading={isCreating} onClick={createVault} colorScheme="messenger">
        Create Vault
      </Button>
    </Stack>
  )
}

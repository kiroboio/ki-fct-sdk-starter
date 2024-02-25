import { Alert, HStack, Icon, Text } from '@chakra-ui/react'
import { AlertCircle } from 'react-feather'

export const ExternalWalletMissingAlert = ({ fctId }: { fctId: string }) => {
  return (
    <HStack width="full" p="4" backgroundColor="gray.800" rounded="2xl">
      {/* <AlertIcon /> */}
      <Icon as={AlertCircle} color="yellow.500" boxSize="22px" mr="10px" />
      <Text>At present, unauthorized external wallet approvals are not supported by Flow,</Text>
    </HStack>
  )
}

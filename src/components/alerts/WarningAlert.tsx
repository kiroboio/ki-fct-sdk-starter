import { Alert, HStack, Icon, Text } from '@chakra-ui/react'
import { AlertCircle } from 'react-feather'

export const WarningAlert = ({ message }: { message: string }) => {
  return (
    <HStack width="full" p="4" backgroundColor="gray.800">
      <Icon as={AlertCircle} color="yellow.500" boxSize="22px" mr="10px" />
      <Text>{message}</Text>
    </HStack>
  )
}

import { HStack, Box, Text } from '@chakra-ui/react'
import { useComputed, service } from '@kiroboio/fct-sdk'
import { Icon } from '@iconify/react'

const NetworkTag = () => {
  const fuel = useComputed(() => service.fct.fuel.data.fmt.value)
  const gasPrice = useComputed(() => (+service.network.data.raw.value.gasPrice / 1e9).toFixed(2) + ' Gwei')
  return (
    <HStack justifyContent="space-between" w="full" fontSize="sm">
      <HStack>
        <Icon icon={`solar:fire-square-bold`} width={24} />
        <Box fontWeight="semibold">
          <Text display="inline" color="gray.500" fontWeight="normal">
            FCT Power:
          </Text>{' '}
          {fuel.value.balance.eth} ETH
        </Box>
      </HStack>
      <HStack>
        <Icon icon={`uis:chart`} width={24} />
        <Box fontWeight="semibold">
          <Text display="inline" color="gray.500" fontWeight="normal">
            Network:
          </Text>{' '}
          <>{gasPrice}</>
        </Box>
      </HStack>
    </HStack>
  )
}

export default NetworkTag

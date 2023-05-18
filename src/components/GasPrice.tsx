import { Tag, TagLabel } from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import { service, useComputed } from '@kiroboio/fct-sdk'

export default function GasPrice() {
  const gasPrice = useComputed(() => (+service.network.data.raw.value.gasPrice / 1e9).toFixed(2) + ' Gwei')
  return (
    <Tag ml={3} colorScheme="red">
      <Icon icon="ic:round-local-gas-station" width="16px" height="16px" />
      <TagLabel fontSize="xs" ml={1} bgGradient="linear(to-l, rgb(255, 132, 51), rgb(243, 32, 45))" bgClip="text" fontWeight="extrabold">
        <>{gasPrice}</>
      </TagLabel>
    </Tag>
  )
}

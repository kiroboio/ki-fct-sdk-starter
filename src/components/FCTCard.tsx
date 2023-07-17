import { Badge, Box, ButtonGroup, Card, CardBody, HStack, IconButton, Stack, Text, Spinner } from '@chakra-ui/react'
import { useComputed, service } from '@kiroboio/fct-sdk'
import { memo } from 'react'
import { Icon } from '@iconify/react'

import { pauseFCT, removeFCT, resumeFCT, signFCT } from '../utils/fcts'

const FCTCard = ({ id }: { id: string }) => {
  const fcts = service.fct.active.data.fmt.map

  const status = useComputed(() => fcts.value[id]?.status)
  const gas_price_limit = useComputed(() => fcts.value[id]?.gas_price_limit)
  const createdAt = useComputed(() => fcts.value[id]?.createdAt)

  const isRemoving = useComputed(() => service.fct.active.remove.isRunning(id).value)
  const isSigning = useComputed(() => service.fct.active.addSignature.isRunning(id).value)
  const isBlocked = useComputed(() => fcts.value[id]?.health.unblocked)

  const signButton = useComputed(() =>
    isSigning.value ? (
      <Spinner marginLeft={3} marginRight={3} />
    ) : (
      <IconButton aria-label="Sign" icon={<Icon icon={`fluent:signature-28-filled`} />} colorScheme="whatsapp" onClick={() => signFCT(id)} />
    )
  )

  const pauseButton = useComputed(() =>
    isBlocked.value ? (
      <IconButton aria-label="Pause" icon={<Icon icon={`fa6-solid:pause`} />} colorScheme="messenger" onClick={() => pauseFCT(id)} />
    ) : (
      <IconButton aria-label="Pause" icon={<Icon icon={`fa6-solid:pause`} />} colorScheme="messenger" onClick={() => resumeFCT(id)} />
    )
  )

  const removeButton = useComputed(() =>
    isRemoving.value ? (
      <Spinner marginLeft={3} marginRight={3} />
    ) : (
      <IconButton aria-label="Delete" icon={<Icon icon={`ph:trash-bold`} />} colorScheme="red" onClick={() => removeFCT(id)} />
    )
  )

  return (
    <Card variant="outline">
      <CardBody>
        <Stack spacing={3}>
          <HStack justify="space-between" align="center">
            <Text fontWeight="bold">Untitled</Text>
            <Badge variant="outline">{status}</Badge>
          </HStack>
          <HStack justify="space-between" align="center" fontSize="sm" color="gray.500">
            <HStack spacing={1}>
              <Icon icon={`iconamoon:clock-bold`} width={16} />
              <Text>{createdAt}</Text>
            </HStack>
            <HStack spacing={1}>
              <Icon icon={`tabler:gas-station`} width={16} />
              <Text>{gas_price_limit} gwai </Text>
            </HStack>
            <ButtonGroup size="xs" variant="outline" spacing={0.5}>
              <>{signButton}</>
              <>{pauseButton}</>
              <>{removeButton}</>
            </ButtonGroup>
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  )
}

const MemoFCTCard = memo(FCTCard)

export default MemoFCTCard

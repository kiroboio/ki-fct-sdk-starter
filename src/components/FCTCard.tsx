import { Badge, Box, ButtonGroup, Card, CardBody, HStack, IconButton, Stack, Text } from '@chakra-ui/react'
import { useComputed, service } from '@kiroboio/fct-sdk'
import { memo } from 'react'
import { Icon } from '@iconify/react'

const FCTCard = ({ id }: { id: string }) => {
  const fcts = service.fct.active.data.fmt.map

  const status = useComputed(() => fcts.value[id]?.status)
  const gas_price_limit = useComputed(() => fcts.value[id]?.gas_price_limit)
  const createdAt = useComputed(() => fcts.value[id]?.createdAt)

  return (
    <Card variant="outline">
      <CardBody>
        <Stack spacing={3}>
          <HStack justify="space-between" align="center">
            <Text fontWeight="bold">Untitled</Text>
            <Badge>{status}</Badge>
          </HStack>
          <HStack justify="space-between" align="center" fontSize="sm" color="gray.500">
            <HStack spacing={1}>
              <Icon icon={`iconamoon:clock-bold`} width={18} />
              <Text>{createdAt}</Text>
            </HStack>
            <HStack spacing={1}>
              <Icon icon={`tabler:gas-station`} width={18} />
              <Text as="strong">{gas_price_limit} Gwai </Text>
            </HStack>
            <ButtonGroup size="xs" variant="outline" colorScheme="teal" spacing={1} isAttached>
              <IconButton aria-label="Sign" icon={<Icon icon={`fluent:signature-28-filled`} />} />
              <IconButton aria-label="Pause" icon={<Icon icon={`fa6-solid:pause`} />} />
              <IconButton aria-label="Delete" icon={<Icon icon={`ph:trash-bold`} />} />
            </ButtonGroup>
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  )
}

const MemoFCTCard = memo(FCTCard)

export default MemoFCTCard

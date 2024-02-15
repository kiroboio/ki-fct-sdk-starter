import type { StackProps } from '@chakra-ui/react'
import { Box, Stack, Text, Center } from '@chakra-ui/react'
import { useFlowHistoryList } from '@kiroboio/fct-sdk'
import type { FC } from 'react'

import { FlowHistoryRow } from './FlowHistoryRow'

export const FlowHistory: FC<StackProps> = () => {
  const flowHistory = useFlowHistoryList()
  const { isLoading, isSuccess, isIdle, error } = flowHistory

  if (error) console.error('FlowHistory error', error)
  if (isIdle) return null
  if (isLoading) return <Text>Loading...</Text>
  if (!flowHistory.list.length && isSuccess)
    return (
      <Stack minH="250px" justify="center" align="center">
        <Text>No items</Text>
      </Stack>
    )

  return (
    <Stack overflowY="auto" maxH="full" textAlign="center" align="center">
      <Stack direction={['column', 'column', 'column', 'column', 'row']} width={['400px', '400px', '400px', '400px', '950px']} fontSize="md">
        <Box textAlign="left" width="100%">
          <Text color="gray.500" fontWeight="semibold">
            Name
          </Text>
        </Box>
        <Box textAlign="left" width="100%">
          <Text color="gray.500" fontWeight="semibold">
            ID
          </Text>
        </Box>
        <Box textAlign="left" width="110%">
          <Text color="gray.500" fontWeight="semibold">
            Time
          </Text>
        </Box>
        <Box textAlign="left" width="100%">
          <Text color="gray.500" fontWeight="semibold">
            Fees
          </Text>
        </Box>
        <Box textAlign="left" width="20%">
          <Text color="gray.500" fontWeight="semibold">
            Calls
          </Text>
        </Box>
      </Stack>
      <Stack overflowY="auto" overflowX="hidden">
        {flowHistory.list.filter(Boolean).map((item) => (
          <FlowHistoryRow key={item.raw.id} item={item} />
        ))}
      </Stack>
    </Stack>
  )
}

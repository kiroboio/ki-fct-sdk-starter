import type { StackProps } from '@chakra-ui/react'
import { Box, Stack, Text, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from '@chakra-ui/react'
import { useActiveFlowList } from '@kiroboio/fct-sdk'
import type { FC } from 'react'

import { ActiveFlowsRow } from './ActiveFlowsRow'

export const ActiveFlows: FC<StackProps> = (props) => {
  const activeFlows = useActiveFlowList()
  const { isLoading, isSuccess, isIdle, error } = activeFlows

  if (error) console.error('ActiveFlows error', error)
  if (isIdle) return null
  if (isLoading) return <Text>Loading...</Text>
  if (!activeFlows.list.length && isSuccess) return <Text>No items</Text>

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>ID</Th>
            <Th>Control</Th>
            <Th>Status</Th>
            <Th>Published At</Th>
            <Th>Max Gas Price</Th>
          </Tr>
        </Thead>
        <Tbody>
          {activeFlows.list.map((item) => (
            <ActiveFlowsRow key={item.raw.id} item={item} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

import type { StackProps } from '@chakra-ui/react'
import { Box, Stack, Text, Table, Thead, Tbody, Tr, Th, TableContainer } from '@chakra-ui/react'
import { useTransfers } from '@kiroboio/fct-sdk'
import type { FC } from 'react'

import { TXHistoryRow } from './TXHistoryRow'

export const TXHistory: FC<StackProps> = () => {
  const txHistory = useTransfers({ account: 'vault' })
  const { isLoading, isSuccess, isIdle, error } = txHistory

  if (error) console.error('TxHistory error', error)
  if (isIdle) return null
  if (isLoading) return <Text>Loading...</Text>
  if (!txHistory.list.length && isSuccess) return <Text>No items</Text>

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Transaction</Th>
            <Th>Amount</Th>
            <Th>Address</Th>
            <Th>Status</Th>
            <Th>Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {txHistory.list.map((item) => (
            <TXHistoryRow key={item.raw.id} item={item} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

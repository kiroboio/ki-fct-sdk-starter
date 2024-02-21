import { Box, Divider, HStack, Icon, Stack, Text, Tooltip, useClipboard, Tr, Td, VStack } from '@chakra-ui/react'
import { type useActiveFlowList } from '@kiroboio/fct-sdk'
import { CheckCircle, Copy, Info, RefreshCw } from 'react-feather'

import { shortenAddress } from '../../utils/address'

const SECOND = 1
const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export const getChillTimeDisplay = (num: number) => {
  const days = num / DAY
  const hours = num / HOUR
  const minutes = num / MINUTE
  const seconds = num / SECOND
  if (Math.floor(days) > 0) {
    return `${days.toFixed(2)} days`
  }
  if (Math.floor(hours) > 0) {
    return `${hours.toFixed(2)} hours`
  }
  if (Math.floor(minutes) > 0) {
    return `${minutes.toFixed(2)} minutes`
  }
  return `${seconds.toFixed(2)} seconds`
}

// TODO: For Tal: fix ActiveFlowsItemType
// export const ActiveFlowsRow = ({ item }: { item: ActiveFlowsItemType }) => {
export const ActiveFlowsRow = ({ item }: { item: ReturnType<typeof useActiveFlowList>['list']['0'] }) => {
  const name = item.raw.data?.typedData?.message?.meta?.name
  const { createdAt, valid_from, expires_at, gas_price_limit } = item.fmt

  const { onCopy, hasCopied } = useClipboard(item.raw.id)

  const isRecurrency = item.raw.recurrency && parseInt(item.raw.recurrency.maxRepeats, 10) > 0
  return (
    <Tr>
      <Td>{name}</Td>
      <Td>
        <Text as="span">
          <Tooltip placement="bottom-start" label="Copy ID" aria-label="A tooltip">
            <HStack
              onClick={() => {
                onCopy()
              }}
              cursor="pointer"
              spacing="0"
              gap="11px">
              <Text fontSize="16px" fontWeight="500">
                {shortenAddress(item.raw.id, 3)}
              </Text>
              <Icon as={hasCopied ? CheckCircle : Copy} color={hasCopied ? 'green.500' : 'unset'} boxSize="16px" />
            </HStack>
          </Tooltip>
        </Text>
      </Td>
      <Td></Td>
      <Td>
        {item.fmt.status}
        {item.fmt.error?.error ? <Text color="red.400" cursor="pointer" title={item.fmt.error?.error}>error</Text> : null}
      </Td>
      <Td>
        <Tooltip label={`Valid between: ${valid_from} - ${expires_at}`} aria-label="A tooltip">
          <Text>
            {createdAt}
            <Icon ml="3px" boxSize="14px">
              <Info />
            </Icon>
          </Text>
        </Tooltip>
      </Td>
      <Td>{gas_price_limit}</Td>
    </Tr>
  )
}

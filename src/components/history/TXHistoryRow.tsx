import { Box, Divider, HStack, Icon, Link, Stack, Text, Tooltip, useClipboard, Tr, Td } from '@chakra-ui/react'
import type { TransferItemType } from '@kiroboio/fct-sdk'
import { useVault } from '@kiroboio/fct-sdk'
import { ArrowDownLeft, ArrowUpRight, CheckCircle, Copy, ExternalLink } from 'react-feather'

import { useBlockchainLink } from '../../hooks/useBlockchainLink'
import { shortenAddress } from '../../utils/address'

import { ImagePopover } from './ImagePopover'

export const TXHistoryRow = ({ item }: { item: TransferItemType }) => {
  const vault = useVault()
  const { txLink } = useBlockchainLink()

  const vaultAddress = vault.data.raw.address

  // const transaction =
  //   tx.to_address.toLowerCase() === vaultAddress.toLowerCase()
  //     ? 'RECEIVE'
  //     : 'SEND';
  const transaction = item.raw.to_address.toLowerCase() === vaultAddress.toLowerCase() ? 'RECEIVE' : 'SEND'
  const address = transaction === 'RECEIVE' ? item.raw.from_address : item.raw.to_address
  const { onCopy, hasCopied } = useClipboard(address)

  // const amount = tx.formatted.valueIsInteger
  //   ? tx.formatted.value
  //   : tx.formatted.valueFormatted;
  const amount = item.fmt.value

  // const imageAvailable = tx.formatted.iconUrl && tx.formatted.iconUrl !== '';
  const imageAvailable = item.fmt.data.iconUrl && item.fmt.data.iconUrl !== ''
  const isNFT = item.raw.event === 'EthNFTTransfers'
  const status = item.raw.confirmed ? 'Done' : 'Not done'

  return (
    <>
      <Tr>
        <Td>
          <HStack spacing="5px" gap="0">
            <Icon boxSize="18px">
              {transaction === 'RECEIVE' && <ArrowDownLeft color="green" />}
              {transaction === 'SEND' && <ArrowUpRight color="orange" />}
            </Icon>
            <Text as="span">
              {transaction} {isNFT && 'NFTs'}{' '}
              {imageAvailable && (
                <ImagePopover
                  src={(item.raw.data?.iconUrl || '').toString()}
                  href={`${txLink}/${item.raw.transaction_hash}`}
                  title={item.raw.data.symbol || ''}
                  label="Display NFT"
                />
              )}
            </Text>
            <Link href={`${txLink}/${item.raw.transaction_hash}`} isExternal>
              <Tooltip placement="top" label="Go to Etherscan" fontSize="md">
                <Icon
                  // onClick={() => {
                  //   mixpanelAnalytics.track({
                  //     label: 'Click_Etherscan',
                  //     payload: {
                  //       location: 'assets_history_screen',
                  //     },
                  //   });
                  // }}
                  mb="2.5px"
                  boxSize="14px">
                  <ExternalLink />
                </Icon>
              </Tooltip>
            </Link>
          </HStack>
        </Td>
        <Td>
          {amount}
          {item.raw.data.symbol}
        </Td>
        <Td>
          <HStack>
            <Text fontSize="16px" fontWeight="500">
              {shortenAddress(address, 3)}
            </Text>
            <Icon as={hasCopied ? CheckCircle : Copy} color={hasCopied ? 'green.500' : 'unset'} boxSize="16px" />
          </HStack>
        </Td>
        <Td>
          <Text>{status}</Text>
        </Td>
        <Td>
          <Text>{item.fmt.timestamp}</Text>
        </Td>
      </Tr>
    </>
  )
}

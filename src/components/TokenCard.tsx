import { Card, CardBody, HStack, Stack, IconButton, Avatar, Text, useDisclosure, Button } from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import { service, useComputed } from '@kiroboio/fct-sdk'
import { memo } from 'react'

import TransferModal from './TransferModal'

const TokenCard = ({ id, isWallet }: { id: string; isWallet: boolean }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const tokens = isWallet ? service.tokens.wallet.data.fmt.map : service.tokens.vault.data.fmt.map
  const name = useComputed(() => tokens.value[id]?.name)
  const balance = useComputed(() => tokens.value[id]?.balance)
  const balanceUsd = useComputed(() => tokens.value[id].balanceUsd)
  const logoURL = useComputed(() => tokens.value[id]?.logo)
  const symbol = useComputed(() => tokens.value[id]?.symbol)

  return (
    <Card size="sm" variant="outline" rounded="md" shadow="sm">
      <CardBody px={5}>
        <HStack justify="space-between">
          <HStack>
            <Avatar size="xs" src={logoURL.value || ''} />
            <Stack spacing={-1}>
              <Text fontWeight="bold">
                <>{symbol}</>
              </Text>
              <Text fontSize="sm" color="gray.500">
                <>{name}</>
              </Text>
            </Stack>
          </HStack>
          <HStack spacing={4}>
            <Stack spacing={-1} textAlign="right">
              <Text fontWeight="bold">
                <>{balance}</>
              </Text>
              <Text fontSize="sm" color="gray.500">
                ${balanceUsd}
              </Text>
            </Stack>
            <IconButton size="sm" rounded="full" aria-label="Send" icon={<Icon icon="akar-icons:arrow-right" />} onClick={onOpen} />
          </HStack>
        </HStack>
        <TransferModal isOpen={isOpen} onClose={onClose} id={id} isWallet={isWallet} />
      </CardBody>
    </Card>
  )
}

const MemoTokenCard = memo(TokenCard)

export default MemoTokenCard

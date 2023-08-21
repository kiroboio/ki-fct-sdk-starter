import { Card, CardBody, Stack, AspectRatio, Heading, HStack, Text, Image, Button, useDisclosure } from '@chakra-ui/react'

import { service, useComputed } from '@kiroboio/fct-sdk'
import { memo } from 'react'

import TransferNFTModal from './TransferNFTModal'

const NFTCard = ({ id, isWallet }: { id: string; isWallet: boolean }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const nfts = isWallet ? service.nfts.wallet.data.fmt.map : service.nfts.vault.data.fmt.map
  const name = useComputed(() => nfts.value[id]?.name)
  const meta = useComputed(() => nfts.value[id]?.metadata)
  const symbol = useComputed(() => nfts.value[id]?.symbol)

  return (
    <Card variant="outline" shadow="sm" p={0} m={0}>
      <CardBody p={0} m={0}>
        <Stack spacing={2}>
          <AspectRatio ratio={1}>
            <Image src={JSON.parse(meta.value).image} alt={name.value} roundedTop="md" />
          </AspectRatio>
          <Stack spacing={1} py={2} px={3}>
            <Heading fontSize="sm">
              <>{name}</>
            </Heading>
            <Text fontSize="xs" color="gray.500">
              <>{symbol}</>
            </Text>
            <Button size="sm" mt={2} onClick={onOpen}>
              Transfer
            </Button>
          </Stack>
        </Stack>
        <TransferNFTModal isOpen={isOpen} onClose={onClose} id={id} isWallet={isWallet} />
      </CardBody>
    </Card>
  )
}

const MemoNFTCard = memo(NFTCard)

export default MemoNFTCard

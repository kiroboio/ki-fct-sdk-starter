import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  HStack,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Checkbox,
  Input,
  Divider,
  Button,
} from '@chakra-ui/react'
import { service, useComputed } from '@kiroboio/fct-sdk'
import { useState } from 'react'

const TransferNFTModal = ({ isOpen, onClose, id, isWallet }: { isOpen: any; onClose: any; id: string; isWallet: boolean }) => {
  const [transferWalletAddress, setTransferWalletAddress] = useState('')
  const [error, setError] = useState('')
  const [isSending, setIsSending] = useState(false)
  const nfts = isWallet ? service.nfts.wallet.data.raw.map : service.nfts.vault.data.raw.map

  const nft = useComputed(() => service.nfts[isWallet ? 'wallet' : 'vault'].data.fmt.map.value[id])
  const amount = useComputed(() => nft.value?.amount)
  const address = useComputed(() => nft.value?.token_address)
  const name = useComputed(() => nft.value?.name)
  const symbol = useComputed(() => nft.value?.symbol)
  const tokenId = useComputed(() => nft.value?.token_id)
  const logo = useComputed(() => (
    <>
      <Image width={150} height={150} src={nft.value?.iconUrl || ''} alt={nft.value?.name || ''} />
    </>
  ))

  const handleModalClose = () => {
    setTransferWalletAddress('')
    setError('')
    setIsSending(false)
    onClose()
  }

  return (
    <>
      <Modal size="sm" isOpen={isOpen} onClose={handleModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">NFT Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={6}>
              <HStack justifyContent="center">{logo}</HStack>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Name</Th>
                      <Th>Amount</Th>
                      <Th>Symbol</Th>
                      <Th>Address</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>{tokenId}</Td>
                      <Td>{name}</Td>
                      <Td>{amount}</Td>
                      <Td>{symbol}</Td>
                      <Td>{address}</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <Divider />
              <Stack spacing={2}>
                <Checkbox>Move to your {isWallet ? 'smart wallet' : 'connected wallet'}</Checkbox>
                <Input disabled={false} placeholder="Ethereum Address" value="" />
              </Stack>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button w="full" colorScheme="blue">
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default TransferNFTModal

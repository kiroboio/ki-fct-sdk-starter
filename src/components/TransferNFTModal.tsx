import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Stack,
  HStack,
  Text,
} from '@chakra-ui/react'
import { service, useComputed } from '@kiroboio/fct-sdk'
import { useState } from 'react'

const TransferNFTModal = ({ isOpen, onClose, id, isWallet }: { isOpen: any; onClose: any; id: string; isWallet: boolean }) => {
  const [transferWalletAddress, setTransferWalletAddress] = useState('')
  const [error, setError] = useState('')
  const [isSending, setIsSending] = useState(false)
  const nfts = isWallet ? service.nfts.wallet.data.raw.map : service.nfts.vault.data.raw.map

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
          <ModalHeader>NFT Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <HStack justify="space-between">
                <Text>Contract Address</Text>
                <Text></Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Token Id</Text>
                <Text>${id}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Token Standard</Text>
                <Text></Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Blockchain</Text>
                <Text></Text>
              </HStack>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default TransferNFTModal

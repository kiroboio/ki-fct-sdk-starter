import { Button, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Input } from '@chakra-ui/react'
import { useVault } from '@kiroboio/fct-sdk'
import { useEffect, useState } from 'react'

import { zeroAddress } from 'viem'
import CreateVaultBox from './CreateVaultBox'

export default function AcountMenu({ isOpen, onClose }) {
  const { data: vault } = useVault()
  const [hasVault, setHasVault] = useState(false)

  useEffect(() => {
    setHasVault(vault.raw.address !== zeroAddress)
  }, [vault.raw.address])
  return (
    <Drawer size="sm" placement="right" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay backdropFilter="auto" backdropBlur="4px" />
      <DrawerContent m={4} rounded="lg">
        <DrawerCloseButton />
        <DrawerBody>{!hasVault ? <CreateVaultBox /> : 'Yes'}</DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

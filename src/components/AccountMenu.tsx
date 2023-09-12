import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  ButtonGroup,
  Button,
  SimpleGrid,
  DrawerCloseButton,
} from '@chakra-ui/react'
import { useVault } from '@kiroboio/fct-sdk'
import { useEffect, useState } from 'react'
import { zeroAddress } from 'viem'

import CreateVaultBox from './CreateVaultBox'
import AccountContent from './AccountContent'
import InfoBox from './InfoBox'

export default function AcountMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [hasVault, setHasVault] = useState(false)
  const { data: vault } = useVault()

  useEffect(() => {
    setHasVault(vault.raw.address !== zeroAddress)
  }, [vault.raw.address])

  return (
    <Drawer size="sm" placement="right" isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay backdropFilter="auto" backdropBlur="4px" />
      <DrawerContent m={4} rounded="lg">
        <DrawerCloseButton />
        {!hasVault ? (
          <CreateVaultBox />
        ) : (
          <>
            <DrawerHeader>Account</DrawerHeader>
            <DrawerBody>
              <AccountContent />
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}

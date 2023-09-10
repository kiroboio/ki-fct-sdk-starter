import { Button, useDisclosure } from '@chakra-ui/react'
import { useNetwork, useSession } from '@kiroboio/fct-sdk'
import AccountMenu from 'components/AccountMenu'

export function LoginButton() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { data: network } = useNetwork()
  const { connectionState, status, login, logout } = useSession()
  const loggedInLabel = status === 'loggingIn' ? 'Please wait...' : status === 'loggedIn' ? 'My account' : 'Login to Kirobo'
  const handleClick = () => {
    console.log(connectionState)
    if (connectionState !== 'authorized' || status === 'loggingIn') {
      return
    }
    if (status === 'loggedIn') {
      onOpen()
    } else {
      login()
    }
  }

  return connectionState === 'authorized' && network.raw.online === true ? (
    <>
      <Button onClick={handleClick}>
        <>{loggedInLabel}</>
      </Button>
      <AccountMenu isOpen={isOpen} onClose={onClose} />
    </>
  ) : null
}

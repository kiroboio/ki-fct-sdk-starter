import { service, useComputed } from '@kiroboio/fct-sdk'
import { Button, useDisclosure } from '@chakra-ui/react'
import AccountPage from './AccountPage'

const KiroButton = ({ onOpen }: { onOpen: any }) => {
  const loggedInLabel = useComputed(() =>
    service.session.status.value === 'loggingIn' ? 'Please wait...' : service.session.status.value === 'loggedIn' ? 'My account' : 'Login'
  )
  const handleClick = () => {
    if (service.session.state.value !== 'authorized' || service.session.status.value === 'loggingIn') {
      return
    }
    if (service.session.status.value === 'loggedIn') {
      onOpen()
    } else {
      service.session.login()
    }
  }
  return (
    <Button colorScheme="messenger" rounded="xl" fontWeight="normal" onClick={handleClick}>
      <>{loggedInLabel}</>
    </Button>
  )
}

export default function LoginButton() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <KiroButton onOpen={onOpen} />
      <AccountPage isOpen={isOpen} onClose={onClose} />
    </>
  )
}

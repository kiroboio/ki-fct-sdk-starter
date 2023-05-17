import { Button } from '@chakra-ui/react'
import { Icon } from '@iconify/react'
import { useComputed, service } from '@kiroboio/fct-sdk'

const shortenAddress = (address?: string | null, length = 4): string => {
  if (!address) return ''
  if (address.length < length * 2 + 5) return address

  const left = address.slice(0, length + 2)
  const right = address.slice(address.length - length)
  return `${left}••••${right}`
}

export default function LoginButton() {
  const loggedInLabel = useComputed(() =>
    service.session.status.value === 'loggingIn' ? 'Please wait...' : service.session.status.value === 'loggedIn' ? 'Logout' : 'Login'
  )
  const handleClick = () => {
    if (service.session.state.value !== 'authorized' || service.session.status.value === 'loggingIn') {
      return
    }
    if (service.session.status.value === 'loggedIn') {
      service.session.logout()
    } else {
      service.session.login()
    }
  }

  return (
    <Button
      onClick={handleClick}
      colorScheme="messenger"
      rounded="xl"
      fontWeight="normal"
      leftIcon={<Icon icon="fluent:cube-32-filled" width="24px" height="24px" />}>
      <>{loggedInLabel}</>
    </Button>
  )
}

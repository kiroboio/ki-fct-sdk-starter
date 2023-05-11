import { Button } from '@chakra-ui/react'
import { Icon } from '@iconify/react'

export default function LoginButton() {
  return (
    <Button colorScheme="messenger" rounded="xl" fontWeight="normal" leftIcon={<Icon icon="fluent:cube-32-filled" width="24px" height="24px" />}>
      Login with Kirobo
    </Button>
  )
}

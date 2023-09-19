import React from 'react'
import { Box, Flex, useColorModeValue, Spacer, Heading, Center } from '@chakra-ui/react'
import { LinkComponent } from './LinkComponent'
import { ThemeSwitcher } from './ThemeSwitcher'
import { ConnectKitButton } from 'connectkit'
import { useSession } from '@kiroboio/fct-sdk'

import Logo from './Logo'
import { LoginButton } from './LoginButton'
import InfoBox from '../InfoBox'

interface Props {
  className?: string
}

export function Header(props: Props) {
  const className = props.className ?? ''
  const { status } = useSession()
  return (
    <Flex
      as="header"
      className={className}
      px={8}
      py={5}
      alignItems="center"
      position="fixed"
      justify="space-between"
      top={0}
      zIndex={1}
      w="full"
      h="80px"
      bg={useColorModeValue('white', 'gray.900')}
      boxShadow="sm"
      backdropFilter="auto"
      backdropBlur="6px">
      <LinkComponent href="/">
        <Heading as="h1" size="md">
          <Logo />
        </Heading>
      </LinkComponent>

      <Flex alignItems="center" gap={4}>
        {status === 'loggedIn' && <InfoBox />}
        <ConnectKitButton />
        <LoginButton />
        <ThemeSwitcher />
      </Flex>
    </Flex>
  )
}

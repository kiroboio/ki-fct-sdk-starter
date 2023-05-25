import React from 'react'
import { Flex, useColorModeValue, Spacer, Heading } from '@chakra-ui/react'
import { LinkComponent } from './LinkComponent'
import { ThemeSwitcher } from './ThemeSwitcher'
import { ConnectKitButton } from 'connectkit'
import Logo from './Logo'
import LoginButton from '../LoginButton'
import { useAccount } from 'wagmi'

interface Props {
  className?: string
}

export function Header(props: Props) {
  const className = props.className ?? ''
  const { address } = useAccount()

  return (
    <Flex
      as="header"
      className={className}
      px={8}
      py={5}
      alignItems="center"
      position="fixed"
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

      <Spacer />

      <Flex alignItems="center" gap={4}>
        <ConnectKitButton />
        {address && <LoginButton />}
        <ThemeSwitcher />
      </Flex>
    </Flex>
  )
}

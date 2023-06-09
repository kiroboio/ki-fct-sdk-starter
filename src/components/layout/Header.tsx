import React from 'react'
import { Flex, useColorModeValue, Spacer, Heading, Tag, TagLabel } from '@chakra-ui/react'
import { LinkComponent } from './LinkComponent'
import { ThemeSwitcher } from './ThemeSwitcher'
import { ConnectKitButton } from 'connectkit'
import Logo from './Logo'
import LoginButton from '../LoginButton'
import GasPrice from 'components/GasPrice'
import { useAccount } from 'wagmi'
import { Icon } from '@iconify/react'

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
      <Tag ml={3} colorScheme="red">
        <Icon icon="ic:round-local-gas-station" width="16px" height="16px" />
        <TagLabel fontSize="xs" ml={1} bgGradient="linear(to-l, rgb(255, 132, 51), rgb(243, 32, 45))" bgClip="text" fontWeight="extrabold">
          <GasPrice />
        </TagLabel>
      </Tag>

      <Spacer />

      <Flex alignItems="center" gap={4}>
        <ConnectKitButton />
        {address && <LoginButton />}
        <ThemeSwitcher />
      </Flex>
    </Flex>
  )
}

import React from 'react'
import { Flex, Link, Text } from '@chakra-ui/react'
import { FaGithub, FaTwitter } from 'react-icons/fa'
import { LinkComponent } from './LinkComponent'
import { SITE_NAME, SOCIAL_GITHUB, SOCIAL_TWITTER } from 'utils/config'

interface Props {
  className?: string
}

export function Footer(props: Props) {
  const className = props.className ?? ''

  return (
    <Flex
      as="footer"
      position="fixed"
      w="full"
      bottom={0}
      className={className}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      py={8}>
      <Text fontSize="sm">
        Powered by{' '}
        <Link href="https://kirobo.io" isExternal>
          Kirobo
        </Link>
      </Text>

      <Flex color="gray.500" gap={2} alignItems="center" mt={2}>
        <LinkComponent href={`https://github.com/${SOCIAL_GITHUB}`}>
          <FaGithub />
        </LinkComponent>
        <LinkComponent href={`https://twitter.com/${SOCIAL_TWITTER}`}>
          <FaTwitter />
        </LinkComponent>
      </Flex>
    </Flex>
  )
}

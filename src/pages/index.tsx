import { Container, Heading, Text } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'

export default function Home() {
  return (
    <>
      <Head />
      <Container maxW="1200px" py={6}>
        <Heading>Kirobo SDK starter kit</Heading>
        <Text>Quickly ship Web3 apps using Next.js and Kirobo FCTs ⚡</Text>
      </Container>
    </>
  )
}

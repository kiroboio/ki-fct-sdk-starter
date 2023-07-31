import { Box, Container, Divider, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import TradingViewWidget from 'components/TradingView'
import LimitForm from 'components/LimitForm'

export default function Home() {
  return (
    <>
      <Head />
      <Container maxW="1200px" py={6}>
        <Heading>Kirobo SDK starter kit</Heading>
        <Text>Quickly ship Web3 apps using Next.js and Kirobo FCTs ⚡</Text>
        <Divider my={12} />
        <Flex gap={6} alignItems="flex-start" direction={['column', 'column', 'row']} mb={6}>
          <Box>
            <LimitForm />
          </Box>
          <Box w="full">
            <TradingViewWidget from="USDC" to="DAI" />
          </Box>
        </Flex>
      </Container>
    </>
  )
}

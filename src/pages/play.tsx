import { useComputed, service } from '@kiroboio/fct-sdk'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import { themes } from 'prism-react-renderer'
import { Box, Container, Divider, HStack, Heading, Stack, Text } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { useState } from 'react'

export default function Play() {
  const innerCode = `const tokens = useComputed(() => service.tokens.wallet.data.fmt.list.value.map(token => (
      <div>
          <img style={{ display: 'inline'}} src={token.logo} />
          <strong style={{color : 'blue'}}> {token.amount} </strong> {token.symbol}
      </div>
    )))
    const wallet = useComputed(() => service.wallet.data.raw.value.address)
    const chain = useComputed(() => service.network.data.raw.value.netId)`
  const jsxCode = `<><div>Tokens of <strong>{wallet}</strong> (<strong>{chain}</strong>)</div>{tokens}</>`

  const defaultCode = `() => {
    ${innerCode}
    return (${jsxCode});
  }`
  const [code, setCode] = useState(defaultCode)

  return (
    <>
      <Head />
      <Container maxW="1200px" py={6}>
        <Stack spacing={2}>
          <Heading>Playground</Heading>
          <Text>Quickly ship Web3 apps using Next.js and Kirobo FCTs ⚡</Text>
        </Stack>
        <Divider my={12} />
        <Box bg="white" color="black" border="1px" borderColor="gray.200" rounded="xl" overflow="hidden">
          <LiveProvider code={code} scope={{ service, useComputed }} noInline={false} theme={themes.vsLight}>
            <HStack align="top" spacing={6} p={6}>
              <LiveEditor />
              <Box maxH="600px" overflowY="auto">
                <LivePreview />
              </Box>
            </HStack>
          </LiveProvider>
        </Box>
      </Container>
    </>
  )
}

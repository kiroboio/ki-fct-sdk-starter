import { Alert, AlertTitle, AlertDescription, Stack, Card, CardBody, Badge, HStack, Box, Text } from '@chakra-ui/react'
import { Icon } from '@iconify/react'

const FCTSTab = (props: { fcts: any }) => {
  const { fcts } = props
  return (
    <>
      {fcts.length === 0 && (
        <Alert
          status="info"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          rounded="lg"
          height="200px">
          <Icon icon="iconoir:network-right" width="40px" height="40px" />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            No FCTs yet
          </AlertTitle>
          <AlertDescription maxWidth="xs">Create a new FCT using Kirobo UI Builder to get started.</AlertDescription>
        </Alert>
      )}
      {fcts.length > 0 && (
        <Stack spacing={3}>
          {fcts.map((fct: any, index: number) => (
            <Card key={index} variant="outline">
              <CardBody>
                <Stack spacing={3}>
                  <Box>
                    <Text fontWeight="bold">Untitled #{index + 1}</Text>
                    <Badge>{fct.status}</Badge>
                  </Box>
                  <HStack justify="space-between" fontSize="sm">
                    <Text>
                      Gas Price: <Text as="strong">{fct.gas_price_limit} Gwai</Text>
                    </Text>
                    <Text color="gray.500">{fct.createdAt}</Text>
                  </HStack>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </Stack>
      )}
    </>
  )
}

export default FCTSTab

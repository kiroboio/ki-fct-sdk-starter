import { Card, CardBody, Stack, AspectRatio, Heading, HStack, Text, Image } from '@chakra-ui/react'

type NFTProps = {
  name: string
  symbol: string
  token_id: string
  metadata?: any
}

const NFTCard = (props: NFTProps) => {
  const { name, symbol, token_id, metadata } = props
  return (
    <Card variant="outline" shadow="sm" p={0} m={0}>
      <CardBody p={0} m={0}>
        <Stack spacing={2}>
          <AspectRatio ratio={1}>
            <Image src={JSON.parse(metadata).image} alt="naruto" roundedTop="md" />
          </AspectRatio>
          <Stack spacing={1} py={2} px={3}>
            <Heading fontSize="sm">{name}</Heading>
            <HStack fontSize="xs" justify="space-between" color="gray.500">
              <Text>{symbol}</Text>
              <Text>{token_id}</Text>
            </HStack>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  )
}

export default NFTCard

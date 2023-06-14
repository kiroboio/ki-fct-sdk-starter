import { Alert, AlertTitle, AlertDescription, SimpleGrid } from '@chakra-ui/react'
import { Icon } from '@iconify/react'

import NFTCard from './NFTCard'

const NFTSTab = (props: { nfts: any }) => {
  const { nfts } = props
  return (
    <>
      {nfts.fmt.value.length === 0 && (
        <Alert
          status="info"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          rounded="lg"
          height="200px">
          <Icon icon="icon-park-outline:picture-album" width="40px" height="40px" />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            No NFTs yet
          </AlertTitle>
          <AlertDescription maxWidth="xs">Buy or transfer NFTs to this wallet to get started.</AlertDescription>
        </Alert>
      )}
      {nfts && (
        <SimpleGrid columns={3} spacing={3}>
          {nfts.fmt.value.map((nft: any, index: number) => (
            <NFTCard key={index} {...nft} />
          ))}
        </SimpleGrid>
      )}
    </>
  )
}

export default NFTSTab

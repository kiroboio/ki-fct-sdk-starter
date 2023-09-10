import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { useNFTs, type NFTsItemType } from '@kiroboio/fct-sdk'

const NFT = ({ nft, account }: { nft: NFTsItemType; account: 'wallet' | 'vault' }) => {
  return <div>{nft.raw.name}</div>
}

export default function NFTTab() {
  const wNfts = useNFTs({ account: 'wallet' })
  const vNfts = useNFTs({ account: 'vault' })

  const nfts = {
    wallet: (
      <>
        {wNfts.list.map((item) => (
          <NFT nft={item} key={item.raw.id} account="wallet" />
        ))}
      </>
    ),
    vault: (
      <>
        {vNfts.list.map((item) => (
          <NFT nft={item} key={item.raw.id} account="vault" />
        ))}
      </>
    ),
  }

  return (
    <Tabs isFitted>
      <TabList>
        <Tab>Vault</Tab>
        <Tab>Wallet</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>{nfts.vault}</TabPanel>
        <TabPanel>{nfts.wallet}</TabPanel>
      </TabPanels>
    </Tabs>
  )
}

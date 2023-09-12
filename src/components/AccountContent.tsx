//@ts-nocheck
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  useTab,
  Text,
  HStack,
  IconButton,
  useClipboard,
  Avatar,
  Stack,
  StackProps,
  Center,
  AspectRatio,
  Heading,
  Image,
} from '@chakra-ui/react'

import { forwardRef, memo } from 'react'
import { CheckIcon, CopyIcon } from '@chakra-ui/icons'
import { Icon } from '@iconify/react'
import { NFTsItemType, service, useNFTs, useTokens, useVault, useWallet } from '@kiroboio/fct-sdk'

export default function AccountContent() {
  const vTokens = useTokens({ account: 'vault' })
  const wTokens = useTokens({ account: 'wallet' })
  const wNfts = useNFTs({ account: 'wallet' })
  const vNfts = useNFTs({ account: 'vault' })
  const { data: wallet } = useWallet()
  const { data: vault } = useVault()

  const NFT = ({ nft, account }: { nft: NFTsItemType; account: 'wallet' | 'vault' }) => {
    const { name, symbol, iconUrl } = nft.fmt
    return (
      <Card variant="outline" shadow="sm" p={0} m={0}>
        <CardBody p={0} m={0}>
          <Stack spacing={2}>
            <AspectRatio ratio={1}>
              <Image src={iconUrl} alt={name} roundedTop="md" />
            </AspectRatio>
            <Stack spacing={1} py={2} px={3}>
              <Heading fontSize="sm">
                <>{name}</>
              </Heading>
              <Text fontSize="xs" color="gray.500">
                <>{symbol}</>
              </Text>
            </Stack>
          </Stack>
        </CardBody>
      </Card>
    )
  }

  const Token = memo(
    forwardRef<HTMLDivElement, TokenPickerItemProps>(({ token, highlight, account, ...props }, ref) => {
      const { symbol, name, balance, balanceUsd, logo } = token.fmt
      return (
        <Card ref={ref} {...props} variant="outline">
          <CardBody px={5}>
            <HStack justify="space-between">
              <HStack>
                <Avatar size="xs" src={logo} />
                <Stack spacing={-1} textAlign="left">
                  <Text fontWeight="bold">{symbol}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {name}
                  </Text>
                </Stack>
              </HStack>
              <HStack spacing={4}>
                <Stack spacing={-1} textAlign="right">
                  <Text fontWeight="bold">{balance}</Text>
                  <Text fontSize="sm" color="gray.500">
                    ${balanceUsd}
                  </Text>
                </Stack>
              </HStack>
            </HStack>
          </CardBody>
        </Card>
      )
    })
  )

  const tokens = {
    wallet: (
      <>
        {wTokens.isLoading ? <Center>Loading...</Center> : wTokens.list.map((token) => <Token token={token} key={token.raw.id} account={'wallet'} />)}
      </>
    ),
    vault: (
      <>
        {vTokens.isLoading ? <Center>Loading...</Center> : vTokens.list.map((token) => <Token token={token} key={token.raw.id} account={'vault'} />)}
      </>
    ),
  }

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

  const wTotalUsd = service.formatting.prebuild.formatValue({
    service: 'tokens',
    name: 'total',
    value: wTokens.list.reduce((acc, cur) => acc + +cur.raw.balanceUsd, 0),
    decimals: 0,
    digits: 2,
  })

  const vTotalUsd = service.formatting.prebuild.formatValue({
    service: 'tokens',
    name: 'total',
    value: vTokens.list.reduce((acc, cur) => acc + +cur.raw.balanceUsd, 0),
    decimals: 0,
    digits: 2,
  })

  // eslint-disable-next-line react/display-name
  const CustomTab = forwardRef((props, ref) => {
    const tabProps = useTab({ ...props, ref })
    const isSelected = !!tabProps['aria-selected']

    const { fmtAddress, rawAddress, icon, balance, children } = tabProps
    const { onCopy, hasCopied } = useClipboard(rawAddress)

    return (
      <Card
        w="full"
        variant={isSelected ? 'outline' : 'solid'}
        borderColor={isSelected ? 'messenger.500' : 'blackAlpha.200'}
        opacity={isSelected ? 1 : 0.35}
        borderWidth={3}
        cursor="pointer"
        {...tabProps}>
        <CardBody>
          <Text fontSize="md" fontWeight="bold">
            {children}
          </Text>
          <HStack spacing={1}>
            <Text fontSize="sm" color="gray.500">
              {fmtAddress}
            </Text>
            <IconButton size="xs" rounded="full" aria-label="Copy Address" icon={hasCopied ? <CheckIcon /> : <CopyIcon />} onClick={onCopy} />
          </HStack>
          <HStack mt={3}>
            <Icon icon={icon} width="24px" height="24px" />
            <Text fontWeight="extrabold" fontSize="xl">
              ${balance}
            </Text>
          </HStack>
        </CardBody>
      </Card>
    )
  })

  interface TokenPickerItemProps extends StackProps {
    highlight?: boolean
    account: 'vault' | 'wallet'
    token: ReturnType<typeof useTokens>['list']['0']
  }

  return (
    <>
      <Tabs size="lg" variant="solid-rounded" isFitted>
        <TabList gap={2}>
          <CustomTab fmtAddress={vault.fmt.address} rawAddress={vault.raw.address} icon="fluent:brain-circuit-20-filled" balance={vTotalUsd}>
            Vault
          </CustomTab>
          <CustomTab fmtAddress={wallet.fmt.address} rawAddress={wallet.raw.address} icon="fluent:brain-circuit-20-filled" balance={wTotalUsd}>
            Wallet
          </CustomTab>
        </TabList>
        <TabPanels mt={6}>
          <TabPanel p={0} pt={4}>
            <Tabs variant="soft-rounded" align="center">
              <TabList>
                <Tab>
                  <HStack spacing={1}>
                    <Icon icon="ph:coins-bold" width="20px" height="20px" />
                    <Text>Tokens</Text>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={1}>
                    <Icon icon="ri:nft-fill" width="20px" height="20px" />
                    <Text>NFTs</Text>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={1}>
                    <Icon icon="clarity:flow-chart-solid" width="20px" height="20px" />
                    <Text>Flows</Text>
                  </HStack>
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0} pt={4}>
                  <Stack>{tokens.vault}</Stack>
                </TabPanel>
                <TabPanel p={0} pt={4}>
                  <HStack spacing={4}>{nfts.vault}</HStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </TabPanel>
          <TabPanel p={0} pt={4}>
            <Tabs variant="soft-rounded" align="center">
              <TabList>
                <Tab>
                  <HStack spacing={1}>
                    <Icon icon="ph:coins-bold" width="20px" height="20px" />
                    <Text>Tokens</Text>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={1}>
                    <Icon icon="ri:nft-fill" width="20px" height="20px" />
                    <Text>NFTs</Text>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={1}>
                    <Icon icon="clarity:flow-chart-solid" width="20px" height="20px" />
                    <Text>Flows</Text>
                  </HStack>
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0} pt={4}>
                  <Stack>{tokens.wallet}</Stack>
                </TabPanel>
                <TabPanel p={0} pt={4}>
                  <HStack spacing={4}>{nfts.wallet}</HStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}

import {
  ButtonGroup,
  HStack,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Card,
  CardBody,
  Divider,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react'
import { NumericFormat } from 'react-number-format'
import { Icon } from '@iconify/react'

import { service, useTokenList, useFlowPower } from '@kiroboio/fct-sdk'

export default function InfoBox() {
  const fuel = useFlowPower()
  const vTokens = useTokenList({ account: 'vault' })
  const wTokens = useTokenList({ account: 'wallet' })

  const wTotalUsd = service.formatting.prebuild.formatValue({
    service: 'tokens',
    name: 'total',
    value: wTokens.list.reduce((acc, cur) => acc + +cur.raw.balanceUsd, 0),
    decimals: 0,
    digits: 2,
  })
  const wTotalEth = service.formatting.prebuild.formatValue({
    service: 'tokens',
    name: 'total',
    value: wTokens.list.reduce((acc, cur) => acc + +cur.raw.balance, 0),
    decimals: 2,
    digits: 2,
  })

  const vTotalUsd = service.formatting.prebuild.formatValue({
    service: 'tokens',
    name: 'total',
    value: vTokens.list.reduce((acc, cur) => acc + +cur.raw.balanceUsd, 0),
    decimals: 0,
    digits: 2,
  })
  const vTotalEth = service.formatting.prebuild.formatValue({
    service: 'tokens',
    name: 'total',
    value: vTokens.list.reduce((acc, cur) => acc + +cur.raw.balance, 0),
    decimals: 0,
    digits: 2,
  })

  return (
    <ButtonGroup spacing={1} justifyContent="space-between" colorScheme="gray">
      <HStack>
        <Button rounded="xl" leftIcon={<Icon icon="streamline:money-safe-vault-saving-combo-payment-safe-money-combination-finance" />}>
          ${vTotalUsd}
        </Button>
        <Button rounded="xl" leftIcon={<Icon icon="streamline:money-wallet-money-payment-finance-wallet" />}>
          ${wTotalUsd}
        </Button>
        <Popover>
          <PopoverTrigger>
            <Button rounded="xl" leftIcon={<Icon icon="streamline:image-flash-2-flash-power-connect-charge-electricity-lightning" />}>
              {fuel.fmt.balance.native} ETH
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader textAlign="center" fontWeight="bold">
              Add Flow Power
            </PopoverHeader>
            <PopoverBody>
              <Tabs isFitted>
                <TabList>
                  <Tab>Easy</Tab>
                  <Tab>Custom</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel p={0}>
                    <FormControl mt={10} mb={6}>
                      <InputGroup size="lg">
                        <InputLeftElement pointerEvents="none">
                          <Icon icon={'solar:fire-square-bold'} width="24px" height="24px" color="#999" />
                        </InputLeftElement>
                        <NumericFormat pr="4.5rem" pl={10} placeholder="0.0" autoComplete="off" customInput={Input} thousandSeparator />
                        <InputRightElement width="4.5rem">
                          <Button h="1.75rem" size="sm">
                            Max
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  </TabPanel>
                  <TabPanel p={0}>
                    <FormControl mt={10} mb={6}>
                      <InputGroup size="lg">
                        <InputLeftElement pointerEvents="none">
                          <Icon icon={'fluent:brain-circuit-20-filled'} width="24px" height="24px" color="#999" />
                        </InputLeftElement>
                        <NumericFormat pr="4.5rem" pl={10} placeholder="0.0" autoComplete="off" customInput={Input} thousandSeparator />
                        <InputRightElement width="4.5rem">
                          <Button h="1.75rem" size="sm">
                            Max
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      <InputGroup size="lg" my={4}>
                        <InputLeftElement pointerEvents="none">
                          <Icon icon={'fluent:wallet-32-filled'} width="24px" height="24px" color="#999" />
                        </InputLeftElement>
                        <NumericFormat pr="4.5rem" pl={10} placeholder="0.0" autoComplete="off" customInput={Input} thousandSeparator />
                        <InputRightElement width="4.5rem">
                          <Button h="1.75rem" size="sm">
                            Max
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  </TabPanel>
                </TabPanels>
              </Tabs>

              <Card variant="outline">
                <CardBody>
                  <FormControl fontSize="sm">
                    <HStack justify="space-between">
                      <Text color="gray.500">Smart Wallet:</Text>
                      <Text as="strong"> {wTotalEth} ETH</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text color="gray.500">Connected Wallet:</Text>
                      <Text as="strong">ETH</Text>
                    </HStack>
                    <Divider my={4} />
                    <HStack justify="space-between">
                      <Text color="gray.500">Total Balance:</Text>
                      <Text as="strong">ETH</Text>
                    </HStack>
                  </FormControl>
                </CardBody>
              </Card>
              <Button mt={4} w="full" colorScheme="messenger">
                Add Funds
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </HStack>
    </ButtonGroup>
  )
}

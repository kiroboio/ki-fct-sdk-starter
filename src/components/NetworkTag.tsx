import {
  HStack,
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  FormHelperText,
  FormControl,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import { useComputed, service } from '@kiroboio/fct-sdk'
import { Icon } from '@iconify/react'
import { SetStateAction, useState } from 'react'
import { NumericFormat } from 'react-number-format'

const NetworkTag = () => {
  const fuel = useComputed(() => service.fct.fuel.data.fmt.value)
  const gasPrice = useComputed(() => (+service.network.data.raw.value.gasPrice / 1e9).toFixed(2) + ' Gwei')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isWallet, setIsWallet] = useState(false)
  const [amount, setAmount] = useState('')
  const [tabIndex, setTabIndex] = useState(0)
  const [isSending, setIsSending] = useState(false)

  const balance = isWallet
    ? service.tokens.wallet.data.fmt.list.value.find((token) => token.symbol === 'ETH')?.amount
    : service.tokens.vault.data.fmt.list.value.find((token) => token.symbol === 'ETH')?.amount

  const handleTabsChange = (index: SetStateAction<number>) => {
    setTabIndex(index)
    setAmount('')
    setIsWallet(index === 1 ? true : false)
  }

  const addFunds = async () => {
    setIsSending(true)

    try {
      await service.vault.fct.actuator.addFunds.execute('funds', [
        {
          valueIn: BigInt('5' + '0'.repeat(16)), // 0.05 ETH funding from wallet
          value: BigInt('10' + '0'.repeat(16)),
          inputs: {},
        },
      ])
    } catch (e) {
      console.log('add fuel error:', service.wallet.erc20.approve.state('allowance').value)
    }
  }

  return (
    <>
      <HStack justifyContent="space-between" w="full" fontSize="sm">
        <HStack>
          <Icon icon={`solar:fire-square-bold`} width={24} onClick={onOpen} />
          <Box fontWeight="semibold">
            <Text display="inline" color="gray.500" fontWeight="normal">
              FCT Power:
            </Text>{' '}
            {fuel.value.balance.eth} ETH
          </Box>
        </HStack>
        <HStack>
          <Icon icon={`uis:chart`} width={24} />
          <Box fontWeight="semibold">
            <Text display="inline" color="gray.500" fontWeight="normal">
              Network:
            </Text>{' '}
            <>{gasPrice}</>
          </Box>
        </HStack>
      </HStack>
      <Modal size="sm" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add FCT Power from</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs variant="solid-rounded" colorScheme="messenger" isFitted index={tabIndex} onChange={handleTabsChange}>
              <TabList>
                <Tab>Smart Wallet</Tab>
                <Tab>Connected Wallet</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <FormControl mt={8}>
                    <InputGroup size="lg">
                      <NumericFormat
                        pr="4.5rem"
                        value={amount}
                        placeholder="0.0"
                        autoComplete="off"
                        customInput={Input}
                        onChange={(e) => setAmount(e.target.value)}
                        thousandSeparator
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={() => setAmount(balance || '')}>
                          Max
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormHelperText mb={3} textAlign="right">
                      Balance:{' '}
                      <Text as="strong">
                        <>{balance}</> ETH
                      </Text>
                    </FormHelperText>
                  </FormControl>
                </TabPanel>
                <TabPanel>
                  <FormControl mt={8}>
                    <InputGroup size="lg">
                      <NumericFormat
                        pr="4.5rem"
                        value={amount}
                        placeholder="0.0"
                        autoComplete="off"
                        customInput={Input}
                        onChange={(e) => setAmount(e.target.value)}
                        thousandSeparator
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={() => setAmount(balance || '')}>
                          Max
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormHelperText mb={3} textAlign="right">
                      Balance:{' '}
                      <Text as="strong">
                        <>{balance}</> ETH
                      </Text>
                    </FormHelperText>
                  </FormControl>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter>
            <Button w="full" colorScheme="messenger" onClick={addFunds} isLoading={isSending}>
              Add Funds
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default NetworkTag

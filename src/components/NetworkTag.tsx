//@ts-nocheck
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
  FormControl,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  InputLeftElement,
  Divider,
  Card,
  CardBody,
  IconButton,
} from '@chakra-ui/react'
import { useComputed, service } from '@kiroboio/fct-sdk'
import { Icon } from '@iconify/react'
import { SetStateAction, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { parseEther } from 'viem'

const NetworkTag = () => {
  const fuel = useComputed(() => service.fct.fuel.data.fmt.value)
  const gasPrice = useComputed(() => (+service.network.data.raw.value.gasPrice / 1e9).toFixed(2) + ' Gwei')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [amount, setAmount] = useState('')
  const [amountSmartWallet, setAmountSmartWallet] = useState('')
  const [amountConnectedWallet, setAmountConnectedWallet] = useState('')
  const [tabIndex, setTabIndex] = useState(0)
  const [isSending, setIsSending] = useState(false)

  const balance = {
    wallet: service.tokens.wallet.data.fmt.list.value.find((token) => token.symbol === 'ETH')?.balance,
    smartwallet: service.tokens.vault.data.fmt.list.value.find((token) => token.symbol === 'ETH')?.balance,
  }

  const total = +balance.wallet + +balance.smartwallet

  const handleTabsChange = (index: SetStateAction<number>) => {
    setTabIndex(index)
    setAmount('')
    setAmountSmartWallet('')
    setAmountConnectedWallet('')
  }

  const error =
    (tabIndex === 0 && amount.length === 0) ||
    (tabIndex === 1 && amountSmartWallet.length === 0 && tabIndex === 1 && amountConnectedWallet.length === 0)

  const addFunds = async () => {
    setIsSending(true)

    try {
      await service.vault.fct.actuator.addFunds.execute('funds', [
        {
          valueIn: parseEther(amount), // 0.05 ETH funding from wallet
          value: parseEther(amount),
          inputs: {},
        },
      ])
    } catch (e) {
      console.log('add fuel error:', service.wallet.erc20.approve.state('allowance').value)
    }
  }

  const handleClose = () => {
    setAmount('')
    setAmountSmartWallet('')
    setAmountConnectedWallet('')
    setIsSending(false)
    onClose()
  }

  return (
    <>
      <HStack justifyContent="space-between" w="full" fontSize="sm">
        <HStack spacing={0}>
          <IconButton
            aria-label="Search database"
            variant="ghost"
            _hover={{ color: 'red.500' }}
            size="sm"
            icon={<Icon icon={`solar:fire-square-bold`} width={24} />}
            onClick={onOpen}
          />
          <Box fontWeight="semibold">
            <Text display="inline" color="gray.500" fontWeight="normal">
              FCT Power:
            </Text>{' '}
            {fuel.value.balance.eth} ETH
          </Box>
        </HStack>
        <HStack spacing={1}>
          <Icon icon={`uis:chart`} width={24} />
          <Box fontWeight="semibold">
            <Text display="inline" color="gray.500" fontWeight="normal">
              Network:
            </Text>{' '}
            <>{gasPrice}</>
          </Box>
        </HStack>
      </HStack>
      <Modal size="sm" isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader textAlign="center">Add FCT Power</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs isFitted index={tabIndex} onChange={handleTabsChange}>
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
                      <NumericFormat
                        pr="4.5rem"
                        pl={10}
                        value={amount}
                        placeholder="0.0"
                        autoComplete="off"
                        customInput={Input}
                        onChange={(e) => setAmount(e.target.value)}
                        thousandSeparator
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={() => setAmount(total)}>
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
                      <NumericFormat
                        pr="4.5rem"
                        pl={10}
                        value={amountSmartWallet}
                        placeholder="0.0"
                        autoComplete="off"
                        customInput={Input}
                        onChange={(e) => setAmountSmartWallet(e.target.value)}
                        thousandSeparator
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={() => setAmountSmartWallet(balance.smartwallet || '')}>
                          Max
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <InputGroup size="lg" my={4}>
                      <InputLeftElement pointerEvents="none">
                        <Icon icon={'fluent:wallet-32-filled'} width="24px" height="24px" color="#999" />
                      </InputLeftElement>
                      <NumericFormat
                        pr="4.5rem"
                        pl={10}
                        value={amountConnectedWallet}
                        placeholder="0.0"
                        autoComplete="off"
                        customInput={Input}
                        onChange={(e) => setAmountConnectedWallet(e.target.value)}
                        thousandSeparator
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={() => setAmountConnectedWallet(balance.wallet || '')}>
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
                    <Text as="strong">
                      <>{(+balance.smartwallet).toFixed(2)}</> ETH
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="gray.500">Connected Wallet:</Text>
                    <Text as="strong">
                      <>{(+balance.wallet).toFixed(2)}</> ETH
                    </Text>
                  </HStack>
                  <Divider my={4} />
                  <HStack justify="space-between">
                    <Text color="gray.500">Total Balance:</Text>
                    <Text as="strong">
                      <>{(+balance.wallet + +balance.smartwallet).toFixed(2)}</> ETH
                    </Text>
                  </HStack>
                </FormControl>
              </CardBody>
            </Card>
          </ModalBody>

          <ModalFooter>
            <Button w="full" colorScheme="messenger" onClick={addFunds} isLoading={isSending} isDisabled={error}>
              Add Funds
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default NetworkTag

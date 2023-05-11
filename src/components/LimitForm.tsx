//@ts-nocheck
import {
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
  InputLeftAddon,
  InputRightAddon,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  Alert,
  AlertIcon,
  Flex,
  Box,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

export default function LimitForm() {
  const [inputToken, setInputToken] = useState('')
  const [outputToken, setOutputToken] = useState('')
  const [inputAmount, setInputAmount] = useState(0)
  const [outputAmount, setOutputAmount] = useState(0)
  const [exchangeRate, setExchangeRate] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (inputAmount && exchangeRate) {
      setOutputAmount((inputAmount * exchangeRate).toFixed(2))
    } else {
      setOutputAmount(0)
    }
  }, [inputAmount, exchangeRate])
  return (
    <>
      <Card minW="320px">
        <CardBody>
          <Stack>
            <Heading fontSize="2xl">Limit</Heading>
            <Text>Place a limit order to trade at a set price</Text>
          </Stack>
          <Divider my={6} />
          <Stack spacing={6}>
            <FormControl>
              <HStack justify="space-between" alignContent="center">
                <Text fontWeight="bold">You Send</Text>
                <FormHelperText>Balance: 0</FormHelperText>
              </HStack>
              <InputGroup mt={2}>
                <NumberInput defaultValue={inputAmount} flex={1}>
                  <NumberInputField onChange={(e) => setInputAmount(e.target.value)} />
                  <InputRightElement w="6rem" ml="auto">
                    <Button w="full" mr={1} size="sm" rightIcon={<FiChevronDown />} onClick={() => setIsModalOpen(true)}>
                      KIRO
                    </Button>
                  </InputRightElement>
                </NumberInput>
              </InputGroup>
            </FormControl>
            <FormControl>
              <Text fontWeight="bold">Limit Price</Text>
              <InputGroup mt={2}>
                <InputLeftAddon fontSize="sm" fontWeight="bold">
                  1 KIRO =
                </InputLeftAddon>
                <Input defaultValue={exchangeRate} onChange={(e) => setExchangeRate(e.target.value)} />
                <InputRightElement w="6rem" ml="auto">
                  <Button w="full" mr={1} size="sm" rightIcon={<FiChevronDown />}>
                    USDC
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Divider />
            <FormControl>
              <HStack justify="space-between" alignContent="center">
                <Text fontWeight="bold">You Get</Text>
              </HStack>
              <InputGroup mt={2}>
                <Input value={outputAmount} readOnly />
                <InputRightAddon fontSize="sm" fontWeight="bold">
                  USDC
                </InputRightAddon>
              </InputGroup>
            </FormControl>
            <Button colorScheme="messenger">Create limite order</Button>
          </Stack>
        </CardBody>
      </Card>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Select a token</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

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
import { service, useComputed } from '@kiroboio/fct-sdk'
import { Head } from 'components/layout/Head'
import { useEffect, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

import TradingViewWidget from 'components/TradingView'
import LimitForm from 'components/LimitForm'
import FCTList from 'components/FCTList'

export default function Home() {
  return (
    <>
      <Head />
      <Container maxW="1200px" py={6}>
        <Heading>Kirobo SDK starter kit</Heading>
        <Text>Quickly ship Web3 apps using Next.js and Kirobo FCTs ⚡</Text>
        <Divider my={12} />
        <Flex gap={6} alignItems="flex-start" direction={['column', 'column', 'row']} mb={6}>
          <Box>
            <LimitForm />
          </Box>
          <Box w="full">
            {/* <TradingViewWidget from="USDC" to="DAI" /> */}
            <FCTList />
          </Box>
        </Flex>
      </Container>
    </>
  )
}

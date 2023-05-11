import { TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Card, CardBody, ButtonGroup, Button, IconButton } from '@chakra-ui/react'
import { FiTrash } from 'react-icons/fi'

export default function FCTList() {
  return (
    <Card>
      <CardBody>
        <TableContainer>
          <Table variant="simple">
            <TableCaption fontSize="sm" color="gray.500">
              *If the tokens in your wallet are less than the number of pending orders, the order will fail
            </TableCaption>
            <Thead>
              <Tr>
                <Th>FCT Name</Th>
                <Th isNumeric>Sent</Th>
                <Th isNumeric>Receive</Th>
                <Th isNumeric>Rate</Th>
                <Th>Gas Price</Th>
                <Th>Created at</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td fontWeight="bold">testActiveList_0</Td>
                <Td isNumeric>6.66</Td>
                <Td isNumeric>25.4</Td>
                <Td isNumeric>5.5</Td>
                <Td>0.75 Gwei</Td>
                <Td>04/20/2023 4:20pm</Td>
                <Td>
                  <ButtonGroup size="sm">
                    <IconButton colorScheme="red" arial-label="Delete" icon={<FiTrash />} aria-label={''} />
                    <Button colorScheme="whatsapp">Sign</Button>
                  </ButtonGroup>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  )
}

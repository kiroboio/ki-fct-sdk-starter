import {
  Card,
  CardBody,
  Button,
  Spinner,
  Tooltip,
  Text,
  IconButton,
  ButtonGroup,
  Td,
  Tr,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tag,
  TagLabel,
  TagLeftIcon,
} from '@chakra-ui/react'
import { service, useComputed } from '@kiroboio/fct-sdk'
import { removeFCT, signFCT3, runCreateFCT } from 'utils/fct'
import { RefObject, createRef, memo } from 'react'
import { FiTrash } from 'react-icons/fi'
import { CheckCircleIcon, WarningTwoIcon } from '@chakra-ui/icons'

const refs: Record<string, RefObject<unknown>> = {}

function ActiveRow({ id }: { id: string }) {
  const item = useComputed(() => service.fct.active.data.fmt.map.value[id])
  const items = service.fct.active.data.fmt.map
  const healthItem = useComputed(() => JSON.stringify(items.value[id]?.health))
  const name = useComputed(() => items.value[id]?.data?.typedData?.message?.meta?.name)
  const createdAt = useComputed(() => item.value.createdAt)
  const maxGasPrice = useComputed(() => items.value[id]?.gas_price_limit || '0')
  const isRemoving = useComputed(() => service.fct.active.remove.isRunning(id).value)
  const isSigning = useComputed(() => service.fct.active.addSignature.isRunning(id).value)

  const health = useComputed(() => (
    <Tooltip
      label={Object.entries(JSON.parse(healthItem.value)).map((item) => (
        <div key={item[0]}>{`${item[0]}:${item[1] ? ' ok' : ' bad'}`}</div>
      ))}>
      {Object.values(JSON.parse(healthItem.value)).some((value) => !value) ? (
        <Tag colorScheme="red">
          <TagLeftIcon boxSize="12px" as={WarningTwoIcon} />
          <TagLabel>BAD</TagLabel>
        </Tag>
      ) : (
        <Tag colorScheme="green">
          <TagLeftIcon boxSize="12px" as={CheckCircleIcon} />
          <TagLabel>OK</TagLabel>
        </Tag>
      )}
    </Tooltip>
  ))

  const removeButton = useComputed(() =>
    isRemoving.value || isSigning.value ? (
      <Spinner marginLeft={3} marginRight={3} />
    ) : (
      <IconButton colorScheme="red" arial-label="Delete" icon={<FiTrash />} aria-label={''} onClick={() => removeFCT(id)} />
    )
  )

  return (
    <Tr>
      <Td fontWeight="bold">
        <>{name}</>
      </Td>

      <Td>
        <>{health}</>
      </Td>
      <Td>
        <>{maxGasPrice} Gwai</>
      </Td>
      <Td fontStyle="italic">
        <>{createdAt}</>
      </Td>
      <Td>
        <ButtonGroup size="sm">
          <>{removeButton}</>
          <Button colorScheme="whatsapp" onClick={() => signFCT3(id)}>
            Sign
          </Button>
        </ButtonGroup>
      </Td>
    </Tr>
  )
}

const ActiveRowMemo = memo(ActiveRow)

function ActiveList() {
  const items = useComputed(() => JSON.stringify(service.fct.active.data.raw.list.value.map((item: any) => ({ id: item.id }))))
  const activeList = useComputed(() => (
    <>
      {JSON.parse(items.value).map((item: any) => {
        if (!refs[item.id]) {
          refs[item.id] = createRef()
        }
        return <ActiveRowMemo key={item.id} id={item.id} />
      })}
    </>
  ))

  return <>{activeList}</>
}

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
                <Th>Health</Th>
                <Th>Gas Price</Th>
                <Th>Created at</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              <ActiveList />
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  )
}

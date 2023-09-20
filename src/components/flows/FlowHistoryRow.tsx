import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Divider,
  HStack,
  Icon,
  Link,
  Stack,
  Text,
  Tooltip,
  useClipboard,
} from '@chakra-ui/react'
import type { FlowHistoryItemType } from '@kiroboio/fct-sdk'
import { CheckCircle, Copy, ExternalLink } from 'react-feather'

import { TextOrShortened } from '../TextOrShortened'
import { useBlockchainLink } from '../../hooks/useBlockchainLink'
import { shortenAddress } from '../../utils/address'

export const FlowHistoryRow = ({ item }: { item: FlowHistoryItemType }) => {
  // const [isCallsClicked, setIsCallsClicked] = useState(false)
  const fctid = item.raw.fctid || 'Unknown'
  const name = item.fmt.name || 'Unknown'
  const { txid } = item.raw
  const time = item.fmt.timestamp
  // TODO: For Tal: fix myFees - on fmt - make it 4 digits after the dot
  // https://kirobo.atlassian.net/browse/KI-1697
  // sdk-fe: create less than 0.0001 number format at formatValue
  const ethTotalFees = item.fmt.myFees.native
  const { calls } = item.fmt

  const { txLink } = useBlockchainLink()
  const { onCopy, hasCopied } = useClipboard(fctid)
  const infoBlock = () => (
    <Box pl={['15px', '15px', '15px', '15px', '0']} bg="blackAlpha.200" _dark={{ bg: 'whiteAlpha.200' }} rounded="xl" py="3">
      <Box position="relative">
        <Text color="gray.400" position="absolute" right="30px">
          <Link href={`${txLink}/${txid}`} isExternal>
            <Icon marginBottom="5px" width="16px">
              <ExternalLink />
            </Icon>
          </Link>
        </Text>
      </Box>
      <Center>
        <Stack
          direction={['column', 'column', 'column', 'column', 'row']}
          width={['400px', '400px', '400px', '400px', '800px']}
          pb={['30px', '30px', '30px', '30px', '0']}
          fontSize="md">
          <Box textAlign="left" width="80%">
            <Text color="gray.500" fontWeight="semibold">
              Call #
            </Text>
          </Box>
          <Box textAlign="left" width="100%">
            <Text color="gray.500" fontWeight="semibold">
              Protocol
            </Text>
          </Box>
          <Box textAlign="left" width="100%">
            <Text color="gray.500" fontWeight="semibold">
              Type
            </Text>
          </Box>
          <Box textAlign="left" width="100%">
            <Text color="gray.500" fontWeight="semibold">
              Method
            </Text>
          </Box>
          <Box textAlign="left" width="100%">
            <Text color="gray.500" fontWeight="semibold">
              Result
            </Text>
          </Box>
        </Stack>
      </Center>
      {calls.map((c) => (
        <Center key={c.index}>
          <Stack
            direction={['column', 'column', 'column', 'column', 'row']}
            width={['400px', '400px', '400px', '400px', '800px']}
            fontSize={['sm', 'sm', 'md']}>
            <Box textAlign="left" width="80%">
              <Text>{c.index.toString()}</Text>
            </Box>
            <Box textAlign="left" width="100%">
              <TextOrShortened text={c.protocol} maxLength={10} inlineSize="150px" overflowWrap="break-word" />
            </Box>
            <Box textAlign="left" width="100%">
              <TextOrShortened text={c.type} maxLength={10} inlineSize="150px" overflowWrap="break-word" />
            </Box>
            <Box textAlign="left" width="100%">
              <TextOrShortened text={c.method} maxLength={10} inlineSize="150px" overflowWrap="break-word" />
            </Box>
            <Box textAlign="left" width="100%">
              <Text>{c.success ? 'SUCCESS' : 'FAIL'}</Text>
            </Box>
          </Stack>
        </Center>
      ))}
    </Box>
  )

  return (
    <>
      <Divider width={['400px', '400px', '400px', '400px', '950px']} />
      <Accordion allowToggle>
        <AccordionItem width={['425px', '425px', '425px', '425px', '980px']} border="none">
          <AccordionButton>
            <Stack direction={['column', 'column', 'column', 'column', 'row']} width={['400px', '400px', '400px', '400px', '950px']} fontSize="md">
              <Box textAlign="left" width="100%">
                <TextOrShortened text={name} maxLength={30} inlineSize="150px" overflowWrap="break-word" />
              </Box>
              <Box textAlign="left" width="100%">
                <Text as="span">
                  <Tooltip placement="bottom-start" label="Copy ID" aria-label="A tooltip">
                    <HStack
                      onClick={(e) => {
                        e.stopPropagation()
                        onCopy()
                      }}
                      cursor="pointer"
                      spacing="0"
                      gap="11px">
                      <Text fontSize="16px" fontWeight="500">
                        {shortenAddress(fctid, 3)}
                      </Text>
                      <Icon as={hasCopied ? CheckCircle : Copy} color={hasCopied ? 'green.500' : 'unset'} boxSize="16px" />
                    </HStack>
                  </Tooltip>
                </Text>
              </Box>
              <Box textAlign="left" width="110%">
                <Text>{time}</Text>
              </Box>
              <Box textAlign="left" width="100%">
                <Text>{ethTotalFees}</Text>
              </Box>
              <Box textAlign="left" width="20%">
                <Text>
                  <AccordionIcon />
                </Text>
              </Box>
            </Stack>
          </AccordionButton>

          <AccordionPanel>{infoBlock()}</AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  )
}

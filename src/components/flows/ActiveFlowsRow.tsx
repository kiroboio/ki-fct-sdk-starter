import { HStack, Icon, Text, Tooltip, useClipboard, Tr, Td, VStack, IconButton, Modal, ModalContent, ModalOverlay, ModalBody } from '@chakra-ui/react'
import { type useActiveFlowList, useNetwork, useVault, useWallet } from '@kiroboio/fct-sdk'
import { CheckCircle, Copy, Info, Activity, Pause, Play } from 'react-feather'
import { BiLinkExternal } from 'react-icons/bi'
import { shortenAddress } from '../../utils/address'
import { useBlockchainLink } from '~/hooks/useBlockchainLink'
import Link from 'next/link'
import { WarningAlert } from '../alerts/WarningAlert'
import { ExternalWalletMissingAlert } from '../alerts/ExternalWalletMissingAlert'
import { FCTMissingAlert } from '../alerts/FctMissingAlert'
import { WalletMissingAlert } from '../alerts/WalletMissingAlert'
import { FCTPauseButton } from '../pauseButton'
import { useState } from 'react'

const SECOND = 1
const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export const getChillTimeDisplay = (num: number) => {
  const days = num / DAY
  const hours = num / HOUR
  const minutes = num / MINUTE
  const seconds = num / SECOND
  if (Math.floor(days) > 0) {
    return `${days.toFixed(2)} days`
  }
  if (Math.floor(hours) > 0) {
    return `${hours.toFixed(2)} hours`
  }
  if (Math.floor(minutes) > 0) {
    return `${minutes.toFixed(2)} minutes`
  }
  return `${seconds.toFixed(2)} seconds`
}

const getPauseState = (disabledPause: boolean, isSelfBlocked: boolean, isBlocked: boolean) => {
  let type = ''
  if (!disabledPause && !isSelfBlocked) {
    type = 'blockable'
  } else if (!disabledPause && isSelfBlocked) {
    type = 'selfBlocked'
  } else if (isBlocked && !isSelfBlocked) {
    type = 'blocked'
  } else if (disabledPause) {
    type = 'disabled'
  }
  return type
}

const maxConfirmations = 20
export const ActiveFlowsRow = ({ item }: { item: ReturnType<typeof useActiveFlowList>['list']['0'] }) => {
  const name = item.raw.data?.typedData?.message?.meta?.name
  const { createdAt, valid_from, expires_at, gas_price_limit } = item.fmt

  const { onCopy, hasCopied } = useClipboard(item.raw.id)
  const {
    data: {
      raw: { height },
    },
  } = useNetwork()
  const { txLink } = useBlockchainLink()
  const {
    data: {
      raw: { address: vaultAddress },
    },
  } = useVault()
  const {
    data: {
      raw: { address: walletAddress },
    },
  } = useWallet()

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false)
  const isGasIssue = item?.raw?.health?.gasPrice === false

  const paused = item.raw.health.unblocked === false || item.raw.health.unpaused === false

  const { stage, needed, id } = item.fmt
  const maxRepeats = Number(item.raw.recurrency?.maxRepeats) || 0
  const isRecurrency = maxRepeats > 0

  const lastRunIndex = item.raw.run.length - 1
  const lastRun = lastRunIndex >= 0 ? item.raw.run[lastRunIndex] : null
  const lastRunTx = lastRun ? lastRun.txhash : null
  const executing = lastRun && lastRun.started && lastRun.inblock === false
  const inBlock = lastRun && lastRun.started && lastRun.inblock === true
  const errorMsg = item.raw.error && item.raw.error.info && item.raw.error.info.msg

  const isRegularPaused = item.raw.blocked.some((el) => el.blocked === true)

  const isSelfRegularPaused = item.raw.blocked.some((el) => el.blocked === true && el.address === vaultAddress)

  const isVirtualPausedExist = item.raw.pause && Boolean(item.raw.pause.length)

  const isVirtualPaused = isVirtualPausedExist && item.raw.pause.some((el) => el.blocked === true)

  const isSelfVirtualPaused = isVirtualPausedExist && item.raw.pause.some((el) => el.blocked === true && el.address === vaultAddress)

  const confirmations = Math.max(1, Math.min(maxConfirmations + 1, (height || 0) - (lastRun?.block || 0) + 1))
  const isExecutingOrConfirming = executing || confirmations > 0
  const disabledPause = isExecutingOrConfirming && !isRecurrency

  const pauseState = {
    regular: getPauseState(disabledPause, isSelfRegularPaused, isRegularPaused),
    virtual: getPauseState(disabledPause, isSelfVirtualPaused, isVirtualPaused),
  }

  const neededApprovals = (needed?.approvals || []).filter((el) => !el.approved)

  const neededVaultApprovals = neededApprovals.filter((el) => el.address.toLowerCase() === vaultAddress.toLowerCase())
  const neededWalletApprovals = neededApprovals.filter((el) => el.address.toLowerCase() === walletAddress.toLowerCase())
  const neededExternalApprovals = neededApprovals.length > neededVaultApprovals.length + neededWalletApprovals.length

  const isStarted = Number(item.raw.valid_from) <= Date.now() / 1000
  const isExpired = Number(item.raw.expires_at) <= Date.now() / 1000

  const ExplorerLink = lastRunTx && (
    <Tooltip label="Block Explorer" aria-label="A tooltip">
      <IconButton
        size="xs"
        variant="link"
        aria-label="Block Explorer"
        target="_blank"
        as={Link}
        href={`${txLink}/${lastRunTx}`}
        icon={<Icon as={BiLinkExternal} boxSize="18px" />}
      />
    </Tooltip>
  )

  const renderStatus = () => {
    let visStatus: 'Error' | 'Warning' | 'Ready' | 'Paused' | 'Executing' | 'InBlock'

    if (paused) {
      visStatus = 'Paused'
    } else if (executing) {
      visStatus = 'Executing'
    } else if (inBlock) {
      visStatus = 'InBlock'
    } else if (!isStarted || isExpired || isGasIssue || neededApprovals || item.raw.error?.type === 2) {
      visStatus = 'Warning'
    } else if (item.raw.health.errorFree) {
      visStatus = 'Ready'
    } else {
      visStatus = 'Error'
    }

    const PauseButton = (
      <FCTPauseButton
        id={id}
        state={pauseState.regular}
        pauseIcon={<Icon as={Pause} boxSize="22px" color="blue.500" />}
        playIcon={<Icon as={Play} boxSize="22px" color="blue.500" />}
      />
    )

    switch (visStatus.toString()) {
      case 'Warning':
        return (
          <HStack>
            <Icon as={Activity} onClick={() => setIsAlertModalOpen(true)} boxSize="16px" color="yellow.500" cursor="pointer" />
            <Text textTransform="capitalize" as="span">
              Pending
            </Text>
          </HStack>
        )

      case 'Ready':
        return (
          <HStack>
            {PauseButton}
            <Text textTransform="capitalize" as="span">
              Ready
            </Text>
          </HStack>
        )

      case 'Paused':
        return (
          <HStack>
            {PauseButton}
            <Text textTransform="capitalize" as="span">
              Paused
            </Text>
          </HStack>
        )
      case 'Executing':
        return (
          <HStack>
            <Text textTransform="capitalize" as="span">
              executing...
            </Text>
            {ExplorerLink}
          </HStack>
        )
      case 'InBlock':
        if (confirmations > maxConfirmations) {
          return (
            <Text textTransform="capitalize" as="span">
              waiting...
            </Text>
          )
        } else {
          return (
            <HStack>
              <Text textTransform="capitalize" as="span">
                {confirmations} / {maxConfirmations}
              </Text>
              {ExplorerLink}
            </HStack>
          )
        }
      case 'Error':
      default:
        return (
          <HStack>
            <Tooltip label={`${errorMsg ? errorMsg : null}`} aria-label="A tooltip">
              <Icon as={Activity} boxSize="16px" color="red.500" cursor="pointer" />
            </Tooltip>
            <Text textTransform="capitalize" as="span">
              Error
            </Text>
          </HStack>
        )
    }
  }
  return (
    <>
      <Modal isOpen={isAlertModalOpen} onClose={() => setIsAlertModalOpen(false)}>
        <ModalOverlay bg="whiteAlpha.200" backdropFilter="blur(4px)" />
        <ModalContent rounded="32px" color="white" bg="#0F151A" p="40px">
          <ModalBody p="0" mt="20px">
            <VStack>
              {isGasIssue && <WarningAlert message="Network gas price too high" />}
              {item.raw.error?.type === 2 && <WarningAlert message="App conditions not fulfilled yet" />}
              {!isStarted && <WarningAlert message="The appointed time has not yet arrived" />}
              {isExpired && <WarningAlert message="Expired" />}
              {stage !== 'executing' && neededExternalApprovals && <ExternalWalletMissingAlert fctId={id} />}
              {stage !== 'executing' && neededVaultApprovals.length > 0 && <FCTMissingAlert missing={neededVaultApprovals} fctId={id} />}
              {stage !== 'executing' && neededWalletApprovals.map((approval) => <WalletMissingAlert key={approval.token} missing={approval} />)}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Tr>
        <Td>{name}</Td>
        <Td>
          <Text as="span">
            <Tooltip placement="bottom-start" label="Copy ID" aria-label="A tooltip">
              <HStack
                onClick={() => {
                  onCopy()
                }}
                cursor="pointer"
                spacing="0"
                gap="11px">
                <Text fontSize="16px" fontWeight="500">
                  {shortenAddress(item.raw.id, 3)}
                </Text>
                <Icon as={hasCopied ? CheckCircle : Copy} color={hasCopied ? 'green.500' : 'unset'} boxSize="16px" />
              </HStack>
            </Tooltip>
          </Text>
        </Td>
        <Td></Td>
        <Td>{renderStatus()}</Td>
        <Td>
          <Tooltip label={`Valid between: ${valid_from} - ${expires_at}`} aria-label="A tooltip">
            <Text>
              {createdAt}
              <Icon ml="3px" boxSize="14px">
                <Info />
              </Icon>
            </Text>
          </Tooltip>
        </Td>
        <Td>{gas_price_limit}</Td>
      </Tr>
    </>
  )
}

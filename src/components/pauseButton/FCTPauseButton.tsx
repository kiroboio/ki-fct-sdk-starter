/* eslint-disable sonarjs/no-duplicate-string */
import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useActiveFlowActions } from '@kiroboio/fct-sdk';
import { PauseButton } from './PauseButton';

export interface PauseButtonType {
  pauseIcon: JSX.Element;
  playIcon: JSX.Element;
  id: string;
  state: string;
}

const userDeniedMsg = 'user rejected transaction';

export const FCTPauseButton = ({
  id,
  state,
  pauseIcon,
  playIcon,
}: PauseButtonType) => {
  const toast = useToast();
  const { block, unblock } = useActiveFlowActions({ id });

  const blockRunning = block.state.isRunning;
  const blockIsDone = block.state.stage === 'done';
  const blockIsFailed = block.state.status === 'failed';
  const blockIsError = block.state.error;
  const blockUserDeniedError = (blockIsError as any)?.reason === userDeniedMsg;

  const unblockRunning = unblock.state.isRunning;
  const unblockIsDone = unblock.state.stage === 'done';
  const unblockIsFailed = unblock.state.status === 'failed';
  const unblockIsError = unblock.state.error;
  const unblockUserDeniedError =
    (unblockIsError as any)?.reason === userDeniedMsg;

  useEffect(() => {
    if (blockIsDone && !blockIsFailed) {
      block.reset();
      toast({
        position: 'bottom-right',
        status: 'info',
        title: 'Flow Paused',
        description: 'Flow was paused on chain',
        duration: 9000,
        isClosable: true,
      });
    }
    if (blockIsFailed && !blockUserDeniedError) {
      block.reset();
      toast({
        position: 'bottom-right',
        status: 'error',
        title: 'Error',
        description: 'Error occurred while pausing',
        duration: 9000,
        isClosable: true,
      });
    }
  }, [
    block,
    blockIsDone,
    blockIsFailed,
    blockUserDeniedError,
    toast,
  ]);

  useEffect(() => {
    if (unblockIsDone && !unblockIsFailed) {
      unblock.reset();
      toast({
        position: 'bottom-right',
        status: 'info',
        title: 'Flow Resumed',
        description: 'Flow was resumed on chain',
        duration: 9000,
        isClosable: true,
      });
    }
    if (unblockIsFailed && !unblockUserDeniedError) {
      unblock.reset();
      toast({
        position: 'bottom-right',
        status: 'error',
        title: 'Error',
        description: 'Error occurred while pausing',
        duration: 9000,
        isClosable: true,
      });
    }
  }, [
    toast,
    unblock,
    unblockIsDone,
    unblockIsFailed,
    unblockUserDeniedError,
  ]);

  if (state === 'blockable') {
    return (
      <PauseButton
        title="Regular Pause"
        description="On chain pause, paid gas"
        leftIcon={pauseIcon}
        isLoading={blockRunning}
        isDisabled={unblockRunning}
        onClick={(e) => {
          e.preventDefault();
          block.execute({});
        }}
      />
    );
  }
  if (state === 'selfBlocked') {
    return (
      <PauseButton
        title="Regular Resume"
        description="On chain pause, paid gas"
        leftIcon={playIcon}
        isLoading={unblockRunning}
        isDisabled={blockRunning}
        onClick={(e) => {
          e.preventDefault();
          unblock.execute({});
        }}
      />
    );
  }
  if (state === 'blocked') {
    return (
      <PauseButton
        title="Regular Pause"
        description="On chain pause, paid gas"
        leftIcon={pauseIcon}
        isDisabled
      />
    );
  }
  if (state === 'disabled') {
    return (
      <PauseButton
        title="Regular Pause"
        description="On chain pause, paid gas"
        leftIcon={pauseIcon}
        isDisabled
      />
    );
  }

  return null;
};

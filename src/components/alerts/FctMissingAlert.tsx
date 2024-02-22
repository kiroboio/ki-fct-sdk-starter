import { Text, HStack, Icon, Link, Spinner } from '@chakra-ui/react';
import { AlertCircle } from 'react-feather';

import {
  BigIntOr0,
  platform,
  useWalletActions,
  type ActiveFlowItemType,
} from '@kiroboio/fct-sdk';

type FCTActiveMissingType = Exclude<
  ActiveFlowItemType['raw']['needed']['approvals'],
  undefined
>;

export const FCTMissingAlert = ({
  missing,
  fctId,
}: {
  missing: FCTActiveMissingType;
  fctId: string;
}) => {
  const { onchain, onchainVaultParams, onchainVaultParam } = useWalletActions({
    id: fctId,
  });

  const generateCall = (missing: FCTActiveMissingType['0']) => {
    if (missing.protocol === 'ERC20') {
      return onchainVaultParam({
        contract: missing.token as `0x${string}`,
        value: BigIntOr0(0),
        abi: platform.abis.ERC20,
        method: 'approve',
        inputs: {
          spender: missing.spender as `0x${string}`,
          amount: BigIntOr0(`0x${'f'.repeat(64)}`), // BigIntOr0(missing.amount),
        },
      });
    }
    if (missing.protocol === 'ERC721') {
      if (missing.method === 'approve' && missing.tokenId) {
        return onchainVaultParam({
          contract: missing.token as `0x${string}`,
          value: BigIntOr0(0),
          abi: platform.abis.ERC721,
          method: 'approve',
          inputs: {
            to: missing.spender as `0x${string}`,
            tokenId: BigIntOr0(missing.tokenId),
          },
        });
      }
      if (missing.method === 'setApprovalForAll') {
        return onchainVaultParam({
          contract: missing.token as `0x${string}`,
          value: BigIntOr0(0),
          abi: platform.abis.ERC721,
          method: 'setApprovalForAll',
          inputs: {
            operator: missing.spender as `0x${string}`,
            approved: true,
          },
        });
      }
    } else if (missing.protocol === 'ERC1155') {
      return onchainVaultParam({
        contract: missing.token as `0x${string}`,
        value: BigIntOr0(0),
        abi: platform.abis.ERC1155,
        method: 'setApprovalForAll',
        inputs: {
          operator: missing.spender as `0x${string}`,
          approved: true,
        },
      });
    }
    return null;
  };

  const handleClick = (e: any) => {
    e.preventDefault();
    const calls = missing.map((m) => generateCall(m)).filter((x) => x);
    console.log('missing', missing);
    console.log('calls', calls);
    if (calls.length) {
      onchain.execute(onchainVaultParams(calls as any));
    }
  };

  const approveRunning = onchain.state.isRunning;

  return (
    <HStack
    width="full"
    p="4"
    backgroundColor="gray.800"
  >
      <Icon as={AlertCircle} color="yellow.500" boxSize="22px" mr="10px" />
      <Text>Flow requires vault approvals</Text>
      {!approveRunning ? (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <Link onClick={handleClick} color="blue.500" ml="1">
          Approve
        </Link>
      ) : (
        <Spinner size="sm" color="blue.500" ml="1" />
      )}
    </HStack>
  );
};

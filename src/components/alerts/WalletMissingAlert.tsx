import { Text, HStack, Icon, Link, Spinner } from '@chakra-ui/react';
import { AlertCircle, ExternalLink } from 'react-feather';
// import { mixpanelAnalytics } from 'src/kirobo/utils/mixpanelAnalytics';

import {
  platform,
  useWalletActions,
  type ActiveFlowItemType,
  BigIntOr0,
} from '@kiroboio/fct-sdk';
import { useBlockchainLink } from '~/hooks/useBlockchainLink';

type WalletMissingType = Exclude<
  ActiveFlowItemType['raw']['needed']['approvals'],
  undefined
>['0'];

export const WalletMissingAlert = ({
  missing,
}: {
  missing: WalletMissingType;
}) => {
  const { tokenLink } = useBlockchainLink();
  const { onchain, onchainParams } = useWalletActions({ id: missing.token });

  const tokenSymbol = missing.metadata?.symbol || 'N/A';

  const handleClick = (e: any) => {
    e.preventDefault();
    if (missing.protocol === 'ERC20') {
      onchain.execute(
        onchainParams({
          contract: missing.token,
          abi: platform.abis.ERC20,
          method: 'approve',
          inputs: {
            spender: missing.spender as `0x${string}`,
            amount: BigIntOr0(`0x${'f'.repeat(64)}`), // BigIntOr0(missing.amount),
          },
        })
      );
    } else if (missing.protocol === 'ERC721') {
      if (missing.method === 'approve' && missing.tokenId) {
        onchain.execute(
          onchainParams({
            contract: missing.token,
            abi: platform.abis.ERC721,
            method: 'approve',
            inputs: {
              to: missing.spender as `0x${string}`,
              tokenId: BigIntOr0(missing.tokenId),
            },
          })
        );
      } else if (missing.method === 'setApprovalForAll') {
        onchain.execute(
          onchainParams({
            contract: missing.token,
            abi: platform.abis.ERC721,
            method: 'setApprovalForAll',
            inputs: {
              operator: missing.spender as `0x${string}`,
              approved: true,
            },
          })
        );
      }
    } else if (missing.protocol === 'ERC1155') {
      onchain.execute(
        onchainParams({
          contract: missing.token,
          abi: platform.abis.ERC1155,
          method: 'setApprovalForAll',
          inputs: {
            operator: missing.spender as `0x${string}`,
            approved: true,
          },
        })
      );
    }
  };

  const approveRunning = onchain.state.isRunning;

  return (
    <HStack
      width="full"
      p="4"
      backgroundColor="gray.800"
    >
      {/* <AlertIcon /> */}
      <Icon as={AlertCircle} color="yellow.500" boxSize="22px" mr="10px" />
      <Link
        style={{ textDecoration: 'none' }}
        href={`${tokenLink}/${missing.token}`}
        isExternal
      >
        {tokenSymbol}
        <Icon
          boxSize="14px"
          as={ExternalLink}
          marginLeft="2px"
          marginRight="4px"
          marginBottom="2px"
        />
      </Link>
      <Text>Token approval is required from your linked wallet</Text>
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

import { core, service, plugins } from '@kiroboio/fct-sdk'
import { FCT_UNISWAP, SWAP_WITHOUT_SLIPPAGE_METHOD, createApprovalsPlugin, type IPlugin, ChainId } from '@kiroboio/fct-core';

type LimitOrderParams = {
    tokenIn: { address?: string; amount?: string }
    tokenOut: { address?: string; amount?: string }
    limit: string
    path: string[]
    chainId: ChainId
    name: string
    autoSign?: 'early' | 'late'
}

const active = service.fct.active

//const refs: Record<string, RefObject<unknown>> = {}

//const isRunning = () => active.publish.state


export enum Flow {
    OK_CONT_FAIL_REVERT = "OK_CONT_FAIL_REVERT",
    OK_CONT_FAIL_STOP = "OK_CONT_FAIL_STOP",
    OK_CONT_FAIL_CONT = "OK_CONT_FAIL_CONT",
    OK_REVERT_FAIL_CONT = "OK_REVERT_FAIL_CONT",
    OK_REVERT_FAIL_STOP = "OK_REVERT_FAIL_STOP",
    OK_STOP_FAIL_CONT = "OK_STOP_FAIL_CONT",
    OK_STOP_FAIL_REVERT = "OK_STOP_FAIL_REVERT",
    OK_STOP_FAIL_STOP = "OK_STOP_FAIL_STOP"
}

export const createLimitOrder = async (params: LimitOrderParams) => {
    //   if (isRunning()) {
    //     throw new Error('running')
    //   }

    console.log({ params })
    const getFlowOptions = ({ nextNodeId }: { nextNodeId?: string }) => {
        return {
            flow: nextNodeId ? Flow.OK_CONT_FAIL_CONT : Flow.OK_STOP_FAIL_REVERT,
            jumpOnSuccess: nextNodeId,
            jumpOnFail: undefined,
        }
    }
    const chainId = params.chainId

    const calls: {
        nodeId: string,
        from: string,
        plugin: IPlugin,
        options: ReturnType<typeof getFlowOptions>
    }[] = []

    const fct = new core.engines.BatchMultiSigCall({ chainId })
    fct.setOptions({
        name: params.name,
        maxGasPrice: service.network.data.raw.gasPrice.fast.maxFeePerGas,
    })

    const WALLET = service.wallet.data.raw.address
    const VAULT = service.vault.data.raw.address
    const AMOUNT_IN = params.tokenIn.amount

    // Transfer tokens from wallet to vault
    calls.push({
        from: VAULT,
        nodeId: 'transferFrom',
        plugin: new plugins.ERC20.actions.TransferFrom({
            chainId,
            initParams: {
                to: params.tokenIn.address,
                methodParams: {
                    from: WALLET,
                    to: VAULT,
                    amount: AMOUNT_IN,
                },
            },
        }),
        options: getFlowOptions({ nextNodeId: 'approve' })
    })



    const PATH = params.path
    const swapPlugin = new FCT_UNISWAP.actions.SwapToNoSlippageProtection({
        chainId,
        initParams: {
            amountIn: AMOUNT_IN,
            addressIn: params.tokenIn.address,
            addressOut: params.tokenOut.address,
            amountOut: '0',
            methodParams: {
                to: WALLET,
                amount: AMOUNT_IN,
                method: SWAP_WITHOUT_SLIPPAGE_METHOD.swapExactTokensForTokens,
                path: PATH,
            },
        },
        walletAddress: WALLET,
        vaultAddress: VAULT,
    })

    const requiredApprovals = swapPlugin.getRequiredApprovals()
    console.log({ requiredApprovals })

    const approvalsPlugin = createApprovalsPlugin({ requiredApprovals, chainId })
    if (approvalsPlugin) {
        calls.push({
            from: VAULT,
            nodeId: 'approve',
            plugin: approvalsPlugin,
            options: getFlowOptions({ nextNodeId: 'swap' })
        })
    }
    // Swap tokens on UniswapV2 and send to wallet
    calls.push({
        from: VAULT,
        nodeId: 'swap',
        plugin: swapPlugin,
        options: getFlowOptions({ nextNodeId: 'greaterEqual' })
    })

    // Ensure that the amount of tokens meets the minimum limit order treashold
    calls.push({
        from: VAULT,
        nodeId: 'greaterEqual',
        plugin: new plugins.TokenValidator.getters.GreaterEqual({
            chainId,
            initParams: {
                methodParams: {
                    amount1: swapPlugin.output.params.amountOut.getOutputVariable('swap'),
                    amount2: params.limit,
                    decimals1: '0',
                    decimals2: '0',
                    decimalsOut: '0',
                },
            },
        }),
        options: getFlowOptions({})
    })


    console.log({ calls })
    await fct.createMultiple(calls)


    console.log({ fct: fct.exportFCT() });

    return {
        fct: fct.exportFCT(),
        map: fct.exportMap(),
        draft: [],
    };

    //return { params: { data: fct.exportFCT(), autoSign: params.autoSign, id: 'limit-order' } } // , signatures: [], sign: true })
}

export const publishLimitOrder = async (params: LimitOrderParams) => {
    const payload = await createLimitOrder(params)

    console.log({ payload })
    const res = await active.publish.execute('limit-order', { payload, autoSign: 'early', }) // , signatures: [], sign: true })

    console.log({ res })
}

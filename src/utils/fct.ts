import { service, core, plugins, cmd } from '@kiroboio/fct-sdk'

const active = service.fct.active
const isRunning = () => active.publish.isRunning().value

type LimitOrderParams = {
  tokenIn: { address: string; amount: string }
  tokensOut: { address: string; amount: string; path?: string[] }[]
  netId: string
  name: string
  autoSign?: 'early' | 'late'
}

const sleep = (milliseconds: number) => {
  return new Promise<void>((r) =>
    setTimeout(() => {
      r()
    }, milliseconds)
  )
}

export const doSomething = cmd<{ param1: string }, 'act1' | 'act2', void>({
  actions: [
    {
      stage: 'act1',
      func: async ({ id, states, params }) => {
        console.log(`[${id}] doSomethig ${states[id].stage.value} ${params}`)
        await sleep(10000)
        return { params }
      },
    },
    {
      stage: 'act2',
      func: async ({ id, states, params }) => {
        console.log(`[${id}] doSomethig ${states[id].stage.value} ${params}`)
        await sleep(5000)
        return { params }
      },
    },
  ],
})

const findPath = async ({ tokenIn, amountIn, tokenOut, netId }: { tokenIn: string; amountIn: string; tokenOut: string; netId: string }) => {
  const chainId = netId === 'goerli' ? '5' : '1'
  const helper = new plugins.UniswapHelper({ account: service.wallet.data.raw.value.address, chainId })
  const swapData = await helper.getSwapParams({
    input: { currency: { address: tokenIn, decimals: 18 }, amount: amountIn },
    output: { currency: { address: tokenOut, decimals: 18 }, amount: amountIn },
  })

  console.log('swapData', swapData)
  if (swapData?.state === 'INVALID') {
    throw new Error('Wrong trade')
  }
  const trade = swapData?.trade?.trade?.routes.find((swap) => swap.protocol === 'V2')
  if (!trade) {
    throw new Error('Unsupported trade')
  }
  return trade.path.map((token) => token.address) // [TOKEN_IN, TOKEN_OUT] //swapData?.params?.methodParams?.path
}

const createLimitOrder = async (params: LimitOrderParams) => {
  const chainId = params.netId === 'goerli' ? '5' : '1'

  const fct = new core.engines.BatchMultiSigCall({ chainId })
  fct.setOptions({
    name: params.name,
    builder: service.meta.data.raw.value.builder,
    maxGasPrice:
      Math.floor(Math.max(500000000, 1.5 * ((await service.session.getSigner()?.provider?.getGasPrice())?.toNumber() || 0))).toString() ||
      '500000000',
  })

  const WALLET = service.wallet.data.raw.value.address
  const VAULT = service.vault.data.raw.value.address
  const AMOUNT_IN = params.tokenIn.amount
  const TOKEN_IN = params.tokenIn.address

  // Transfer tokens from wallet to vault
  await fct.create({
    from: VAULT,
    plugin: new plugins.ERC20.actions.TransferFrom({
      chainId,
      initParams: {
        to: TOKEN_IN,
        methodParams: {
          from: WALLET,
          to: VAULT,
          amount: AMOUNT_IN,
        },
      },
    }),
  })

  for (let i = 0; i < params.tokensOut.length; ++i) {
    const tokenOut = params.tokensOut[i]
    const TOKEN_OUT = tokenOut.address
    const AMOUNT_OUT = tokenOut.amount
    const PATH = tokenOut.path || [TOKEN_IN, tokenOut.address]

    const swapPlugin = new plugins.Uniswap.actions.UniswapV2SwapExactTokensForTokens({
      chainId,
      initParams: {
        methodParams: {
          to: WALLET,
          amountIn: AMOUNT_IN,
          amountOutMin: '0',
          deadline: core.variables.globalVariables.blockTimestamp,
          path: PATH,
        },
      },
    })

    await fct.create({
      from: VAULT,
      plugin: new plugins.ERC20.actions.Approve({
        chainId,
        initParams: {
          to: params.tokensOut[i].address,
          methodParams: {
            spender: swapPlugin.input.params.to.value?.toString() || '',
            amount: AMOUNT_IN,
          },
        },
      }),
    })

    // Swap tokens on UniswapV2 and send to wallet
    await fct.create({
      from: VAULT,
      plugin: swapPlugin,
    })

    // Ensure that the amount of tokens meets the minimum limit order treashold
    await fct.create({
      from: VAULT,
      plugin: new plugins.Validator.getters.GreaterEqual({
        chainId,
        initParams: {
          methodParams: {
            // value1: FCT.constants.getFDBack({ callIndex: 1, innerIndex: 0 }),
            value1: fct.variables.getOutputVariable({ index: 3 + 3 * i, innerIndex: -1 }),
            value2: AMOUNT_OUT,
          },
        },
      }),
      options: {
        flow: i === params.tokensOut.length ? core.constants.Flow.OK_CONT_FAIL_REVERT : core.constants.Flow.OK_STOP_FAIL_CONT,
      },
    })
  }

  return { params: { data: fct.exportFCT(), autoSign: params.autoSign, id: 'limit-order' } } // , signatures: [], sign: true })
}

export const publishLimitOrder = async (params: LimitOrderParams) => {
  try {
    const id = 'limit-order'
    await active.publish.execute(id, async () => await createLimitOrder(params))
  } catch (e) {
    console.log(e)
  }
}

const createFCT = async ({ from, netId, name, autoSign }: { from: string; netId: string; name: string; autoSign?: 'early' | 'late' }) => {
  const chainId = netId === 'goerli' ? '5' : '1'

  const fct = new core.engines.BatchMultiSigCall({ chainId })
  fct.setOptions({
    name,
    builder: service.meta.data.raw.value.builder,
    maxGasPrice:
      Math.floor(Math.max(500000000, 1.5 * ((await service.session.getSigner()?.provider?.getGasPrice())?.toNumber() || 0))).toString() ||
      '500000000',
  })
  const KIRO = service.network.data.raw.value.contracts?.KiroToken.address
  if (!KIRO) {
    throw Error('no kiro')
  }
  // await sleep(10000);

  const RECIPIENT = service.wallet.data.raw.value.address
  const AMOUNT = '1' + '0'.repeat(18)

  // With plugins
  await fct.create({
    from,
    plugin: new plugins.ERC20.actions.Transfer({
      chainId,
      initParams: {
        to: KIRO,
        methodParams: {
          recipient: RECIPIENT,
          amount: AMOUNT,
        },
      },
    }),
  })

  // Without plugins
  await fct.create({
    from,
    to: KIRO,
    method: 'transfer',
    params: [
      {
        name: 'recipient',
        type: 'address',
        value: RECIPIENT,
      },
      { name: 'amount', type: 'uint256', value: AMOUNT },
    ],
  })
  return { params: { data: fct.exportFCT(), autoSign } }
  // await active.publish.clear()
}

export const runCreateFCT = async (params: { from: string; netId: string; name: string; autoSign?: 'early' | 'late' }) => {
  try {
    const id = 'limit-order'
    await active.publish.execute(id, async () => await createFCT(params))
  } catch (e) {
    console.log(e)
  }
}

export const signFCT2 = async (id: string) => {
  try {
    const fct = active.data.raw.map.value[id]
    if (!fct) {
      return
    }
    const types = { ...fct.data.typedData.types }
    delete types.EIP712Domain
    const signature = await (service.session.getSigner() as any)._signTypedData(fct.data.typedData.domain, types, fct.data.typedData.message)
    await active.addSignature.execute(id, { signature })
  } catch (error) {
    console.error(error)
  }
}

export const signFCT3 = async (id: string) => {
  try {
    await active.addSignature.execute(id, async () => {
      const fct = active.data.raw.map.value[id]
      if (!fct) {
        return { params: { id } }
      }
      const types = { ...fct.data.typedData.types }
      delete types.EIP712Domain
      const signature = await (service.session.getSigner() as any)._signTypedData(fct.data.typedData.domain, types, fct.data.typedData.message)
      return { params: { signature, id } }
    })
  } catch (error) {
    console.error('signFCT error ', error)
  } finally {
    console.log('signFCT state', active.addSignature.state(id).value)
  }
}

export const signFCT = async (id: string) => {
  try {
    await active.addSignature.execute(id, {})
  } catch (error) {
    console.error('signFCT Error', error)
  } finally {
    console.log('signFCT state', active.addSignature.state(id).value)
  }
}

export const removeFCT = async (id: string) => {
  try {
    await active.remove.execute(id, {})
  } catch (e) {
    console.log(e)
  }
}

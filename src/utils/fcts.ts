import { service } from '@kiroboio/fct-sdk'

const signFCT = async (id: string) => {
  try {
    await service.fct.active.addSignature.execute(id, {})
  } catch (error) {
    console.error('signFCT Error', error)
  } finally {
    console.log('signFCT state', service.fct.active.addSignature.state(id))
  }
}

const pauseFCT = async (id: string) => {
  try {
    const res = await service.fct.active.block.execute(id, {})
    console.log(res)
  } catch (e) {
    console.log(e)
  }
}

const resumeFCT = async (id: string) => {
  try {
    await service.fct.active.unblock.execute(id, {})
  } catch (e) {
    console.log(e)
  }
}

const removeFCT = async (id: string) => {
  try {
    await service.fct.active.remove.execute(id, {})
  } catch (e) {
    console.log(e)
  }
}

export { signFCT, pauseFCT, resumeFCT, removeFCT }

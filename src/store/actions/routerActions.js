import { isEmpty } from 'lodash'

export const toWallet = () => ({ type: 'WALLET' })
export const toReceive = () => ({ type: 'RECEIVE' })
export const toRestore = () => ({ type: 'RESTORE' })
export const toWelcome = () => ({ type: 'WELCOME' })
export const toNew = () => ({ type: 'NEW' })
export const toLock = () => ({ type: 'LOCK' })
export const toSend = () => ({ type: 'SEND' })
export const toBackup = () => ({ type: 'BACKUP' })
export const toPrevious = state =>
  isEmpty(state.location.prev.type)
    ? toWallet()
    : { type: state.location.prev.type }

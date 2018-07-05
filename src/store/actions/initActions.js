import {
  CREATE_MNEMONIC_FAILURE,
  CREATE_MNEMONIC_REQUEST,
  CREATE_MNEMONIC_SUCCESS,
  CREATE_SEED_SUCCESS,
  CREATE_SEED_REQUEST,
  ADD_SEED_POINT,
  SAVE_WALLET,
  SAVE_WALLET_FAILURE,
} from '../typesReducers'

import { redirect } from 'redux-first-router'
import { toWallet } from './routerActions'

import * as bitcoin from '../../app/lib/bitcoin'
import Seeder from '../../app/lib/bitcoin/bitcoin.seeder'

let seeder

export const initSeed = () => dispatch => {
  const seedLimit = process.env.REACT_APP_ENV === 'development' ? 10 : 200
  seeder = new Seeder(seedLimit)
  dispatch({ type: CREATE_SEED_REQUEST, payload: seeder.seed })
}

export const createSeedFromEvent = e => dispatch => {
  if (seeder.isSeedingDone()) {
    dispatch({ type: CREATE_SEED_SUCCESS, payload: seeder.seed })
    dispatch({ type: CREATE_MNEMONIC_REQUEST })
    bitcoin.mnemonic
      .createMnemonicFromSeed(seeder.seed)
      .then(mnemonic => {
        dispatch({ type: CREATE_MNEMONIC_SUCCESS, payload: mnemonic.phrase })
        // dispatch(redirect(toWallet()))
      })
      .catch(error =>
        dispatch({ type: CREATE_MNEMONIC_FAILURE, error: error.message })
      )
  } else {
    const timeStamp = new Date().getTime()
    // seed mouse position X and Y when mouse movements are greater than 40ms apart.
    if (timeStamp - seeder.lastInputTime > 50) {
      seeder.addEntropyToSeed(e.clientX * e.clientY, timeStamp)
      dispatch({ type: CREATE_SEED_REQUEST, payload: seeder.seed })
      dispatch({
        type: ADD_SEED_POINT,
        payload: { x: e.clientX, y: e.clientY },
      })
    }
  }
}

export const saveWallet = ({
  mnemonic,
  password,
  passwordHint,
}) => dispatch => {
  console.log({ mnemonic, password, passwordHint })
  // encrypt  mnemonic + password
  return bitcoin.utils
    .encrypt({ message: mnemonic, password })
    .then(encryptedMnemonic => {
      // save object valut to localstorage using persistWallet
      dispatch({
        type: SAVE_WALLET,
        payload: { encryptedMnemonic, passwordHint },
      })
      //TODO create first address
      dispatch(redirect(toWallet()))
    })
    .catch(error =>
      dispatch({ type: SAVE_WALLET_FAILURE, error: error.message })
    )
}

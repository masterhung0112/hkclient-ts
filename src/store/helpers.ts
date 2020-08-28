import { Reducer, combineReducers } from 'redux'
import reducerRegistry from './reducer_registry'
import { Action, enableBatching } from 'types/actions'
import { General } from '../constants'

export const offlineConfig = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  effect: (effect: Function, action: Action) => {
    if (typeof effect !== 'function') {
      throw new Error('Offline Action: effect must be a function.')
    } else if (!('meta' in action && action.meta && action.meta.offline.commit)) {
      throw new Error('Offline Action: commit action must be present.')
    }

    return effect()
  },
  discard: (error: Error, action: Action, retries: number) => {
    if ('meta' in action && action.meta && action.meta.offline.hasOwnProperty('maxRetry')) {
      return retries >= action.meta.offline.maxRetry
    }

    return retries > 10
  },
}

export function createReducer(baseState: any, ...reducers: Reducer[]) {
  reducerRegistry.setReducers(Object.assign({}, ...reducers))
  const baseReducer = combineReducers(reducerRegistry.getReducers())

  // Root reducer wrapper that listens for reset events.
  // Returns whatever is passed for the data property
  // as the new state.
  function offlineReducer(state = {}, action: Action) {
    if ('type' in action && 'data' in action && action.type === General.OFFLINE_STORE_RESET) {
      return baseReducer(action.data || baseState, action)
    }

    return baseReducer(state, action as any)
  }

  return enableBatching(offlineReducer)
}

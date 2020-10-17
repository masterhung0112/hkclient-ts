import { AnyAction } from 'redux'
import { CounterTypes } from '../action-types'

export function setCount(payload: number): AnyAction {
  return {
    type: CounterTypes.SET_COUNT,
    payload,
  }
}

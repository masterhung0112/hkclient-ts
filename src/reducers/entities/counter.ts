import { CounterTypes } from 'action-types'
import { CountState } from 'types/counter'
import { GenericAction } from 'types/actions'

export const countReducer = (state: CountState, action: GenericAction): CountState => {
  if (!state) {
    state = {
      count: 0,
    }
  }

  switch (action.type) {
    case CounterTypes.SET_COUNT:
      state = {
        ...state,
        count: action.payload,
      }
      break
  }

  return state
}
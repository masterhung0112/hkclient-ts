import { GlobalState } from './store'
import { Reducer } from 'redux'

export type GetStateFunc = () => GlobalState
export type GenericAction = {
  type: string
  data?: any
  meta?: any
  error?: any
  index?: number
  displayable?: boolean
  postId?: string
  sessionId?: string
  currentUserId?: string
  // eslint-disable-next-line @typescript-eslint/ban-types
  remove?: Function | string[]
  timestamp?: number
  [extraProps: string]: any
}
export type Thunk = (b: DispatchFunc, a: GetStateFunc) => Promise<ActionResult> | ActionResult

type BatchAction = {
  type: 'BATCHING_REDUCER.BATCH'
  payload: Array<GenericAction>
  meta: {
    batch: true
  }
}

export type ActionResult =
  | {
      data: any
    }
  | {
      error: any
    }

export type DispatchFunc = (action: Action, getState?: GetStateFunc | null) => Promise<ActionResult>

export type ActionFunc = (
  dispatch: DispatchFunc,
  getState: GetStateFunc
) => Promise<ActionResult | ActionResult[]> | ActionResult

export type Action = GenericAction | Thunk | BatchAction | ActionFunc

export function enableBatching<S>(reduce: Reducer<S>): Reducer<S> {
  return function batchingReducer(state, action) {
    if (action && 'meta' in action && action.meta.batch) {
      return action.payload.reduce(batchingReducer, state)
    }
    return reduce(state, action)
  }
}

import { ActionFunc } from 'types/actions'

export * from './action-types'
export * from './actions'
export * from './constants'
export * from './hkclient'
export * from './reducers'
// export * from './selectors'
export * from './store'
// export * from './types'
// export * from './utils'

declare module 'redux' {
  /*
   * Overload to add thunk support to Redux's dispatch() function.
   * Useful for react-redux or any other library which could use this type.
   */
  export interface Dispatch<A extends Action = AnyAction> {
    <TReturnType = any>(actionFunc: ActionFunc): TReturnType
  }
}

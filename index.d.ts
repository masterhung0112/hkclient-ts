import {
  Action,
  ActionCreatorsMapObject,
  AnyAction,
  Dispatch,
  Middleware,
} from 'redux'

import { ActionFunc } from './src/types/actions'

declare module 'redux' {
    /*
    * Overload to add thunk support to Redux's dispatch() function.
    * Useful for react-redux or any other library which could use this type.
    */
   export interface Dispatch<A extends Action = AnyAction> {
     <TReturnType = any>(
       actionFunc: ActionFunc,
     ): TReturnType;
   }
 }
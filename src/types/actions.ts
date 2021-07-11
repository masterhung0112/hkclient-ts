// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {Reducer} from 'redux';
import {GlobalState} from './store';

export type GetStateFunc = () => GlobalState;
export type GenericAction = {
    type: string;
    data?: any;
    meta?: any;
    error?: any;
    index?: number;
    displayable?: boolean;
    postId?: string;
    sessionId?: string;
    currentUserId?: string;
    timestamp?: number;
    [extraProps: string]: any;
};
export type Thunk = (b: DispatchFunc, a: GetStateFunc) => Promise<ActionResult> | ActionResult;

type BatchAction = {
  type: 'BATCHING_REDUCER.BATCH';
  payload: GenericAction[];
  meta: {
    batch: true;
  };
}

export type ActionResult = {
  error?: any;
  data?: any;
}

export type ActionResultType = ActionResult

// export type DispatchFunc = (action: Action, getState?: GetStateFunc | null) => Promise<ActionResultType>
export interface DispatchFunc<A = GenericAction | Thunk | BatchAction | ActionFunc> {
  <TReturnType = ActionResultType>(actionFunc: A): Promise<TReturnType>;
  <TReturnType = ActionResultType>(actionFuncs: A[]): Promise<TReturnType>;
}

export type ActionFunc = (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<ActionResult | ActionResult[]> //| ActionResult

export type Action = GenericAction | Thunk | BatchAction | ActionFunc

export type ActionCreatorClient<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => ReturnType<ReturnType<T>>

export function enableBatching<S>(reduce: Reducer<S>): Reducer<S> {
    return function batchingReducer(state, action) {
        if (action && 'meta' in action && action.meta.batch) {
            return action.payload.reduce(batchingReducer, state);
        }
        return reduce(state, action);
    };
}

export const BATCH = 'BATCHING_REDUCER.BATCH';

export function batchActions(actions: Action[], type = BATCH) {
    return {type, meta: {batch: true}, payload: actions};
}

export interface ExtActionCreator<A = ActionFunc> {
  (...args: any[]): A;
}

/**
 * Object whose values are action creator functions.
 */
export interface ExtActionCreatorsMapObject<A = ActionFunc> {
  [key: string]: ExtActionCreator<A>;
}

declare module 'redux' {

  /*
   * Overload to add thunk support to Redux's dispatch() function.
   * Useful for react-redux or any other library which could use this type.
   */
  //<A extends Action = AnyAction>
  export interface Dispatch {
    <TReturnType = ActionResultType>(actionFunc: ActionFunc): TReturnType;
    <TReturnType = ActionResultType>(actionFuncs: ActionFunc[]): TReturnType;
    <TReturnType = ActionResultType>(actions: AnyAction[]): TReturnType;
    <TReturnType = ActionResultType>(actions: Array<AnyAction | ActionFunc>): TReturnType;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function bindActionCreators<A, M extends ExtActionCreatorsMapObject<any>>(
    actionCreator: M,
    dispatch: DispatchFunc
  ): {
    [K in keyof M]: ActionCreatorClient<M[K]>
  }
}

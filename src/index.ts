// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {ActionFunc} from 'types/actions';

export * from './action_types';
export * from './actions';
export * from './constants';
export * from './client';
export * from './reducers';

// export * from './selectors'
export * from './store';

// export * from './types'
// export * from './utils'

declare module 'redux' {

  /*
   * Overload to add thunk support to Redux's dispatch() function.
   * Useful for react-redux or any other library which could use this type.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface Dispatch<A extends Action = AnyAction> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <TReturnType = any>(actionFunc: ActionFunc): TReturnType;
  }
}

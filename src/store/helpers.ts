// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {Action} from 'types/actions';

export const offlineConfig = {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    effect: async (effect: any, action: Action): Promise<any> => {
        if (typeof effect !== 'function') {
            throw new Error('Offline Action: effect must be a function.');
        } else if (!('meta' in action && action.meta && action.meta.offline.commit)) {
            throw new Error('Offline Action: commit action must be present.');
        }

        return effect();
    },
    discard: (error: Error, action: Action, retries: number): boolean => {
        if ('meta' in action && action.meta && Object.prototype.hasOwnProperty.call(action.meta.offline, 'maxRetry')) {
            return retries >= action.meta.offline.maxRetry;
        }

        return retries > 10;
    },
};

// export function createReducer(baseState: Record<string, any>, ...reducers: Reducer[]) {
//   // reducerRegistry.setReducers(Object.assign({}, ...reducers))
//   const baseReducer = combineReducers(reducers)

//   // Root reducer wrapper that listens for reset events.
//   // Returns whatever is passed for the data property
//   // as the new state.
//   function offlineReducer(state = {}, action: Action) {
//     if ('type' in action && 'data' in action && action.type === General.OFFLINE_STORE_RESET) {
//       return baseReducer(action.data || baseState, action)
//     }

//     return baseReducer(state, action as any)
//   }

//   return offlineReducer
// }

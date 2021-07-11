// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {AsyncNodeStorage} from 'redux-persist-node-storage';
import {createTransform, persistStore} from 'redux-persist';

import configureStore from 'store';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (loadedModule = [], preloadedState = null) => {
    const storageTransform = createTransform(
        () => ({}),
        () => ({}),
    );

    // const persistConfig = {
    //     persist: (store, options) => {
    //         return persistStore(store, {storage: new AsyncNodeStorage('./.tmp'), ...options});
    //     },
    //     persistOptions: {
    //         debounce: 1000,
    //         transforms: [
    //             storageTransform,
    //         ],
    //         whitelist: [],
    //     },
    // };

    const offlineConfig = {
        detectNetwork: (callback) => callback(true),
        persist: (store) => {
            return persistStore(store, {storage: new AsyncNodeStorage('./.tmp')});
        },
        persistOptions: {
            debounce: 1000,
            transforms: [storageTransform],
            whitelist: [],
        },
        retry: (action, retries) => 200 * (retries + 1),
        discard: (error, action, retries) => {
            if (action.meta && Object.prototype.hasOwnProperty.call(action.meta.offline, 'maxRetry')) {
                return retries >= (action.meta.offline).maxRetry;
            }

            return retries >= 1;
        },
    };

    // const store = configureStore(preloadedState, {}, persistConfig, () => ({}));
    const store = configureStore(preloadedState, offlineConfig, [...loadedModule]);

    return store;
};

// This should probably be replaced by redux-mock-store like the web app
export function mockDispatch(dispatch) {
    const mocked = (action) => {
        dispatch(action);

        mocked.actions.push(action);
    };

    mocked.actions = [];

    return mocked;
}

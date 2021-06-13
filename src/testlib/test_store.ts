// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {AsyncNodeStorage} from 'redux-persist-node-storage';
import {createTransform, persistStore} from 'redux-persist';

import configureStore from '../store';
import {Config} from '@redux-offline/redux-offline/lib/types';
import {IModule} from 'redux-dynamic-modules-core';

export default function testConfigureStore(loadedModule: Array<IModule<any>> = [], preloadedState = null) {
    const storageTransform = createTransform(
        () => ({}),
        () => ({}),
    );

    //TODO: Upgrade redux-persist to v6 (https://gist.github.com/jarvisluong/f14872b9c7ed00bc2afc89c4622e3b55)
    const offlineConfig: Partial<Config> = {
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
                return retries >= (action.meta.offline as any).maxRetry;
            }

            return retries >= 1;
        },
    };

    // const store = configureStore(preloadedState, {}, offlineConfig, () => ({}), { enableBuffer: false })

    const store = configureStore(preloadedState, offlineConfig, [...loadedModule]);

    // const wait = () => new Promise((resolve) => setTimeout(resolve, 300)) //eslint-disable-line
    // await wait()

    return store;
}

// This should probably be replaced by redux-mock-store like the web app
export function mockDispatch(dispatch) {
    const mocked = (action) => {
        dispatch(action);

        mocked.actions.push(action);
    };

    mocked.actions = [];

    return mocked;
}

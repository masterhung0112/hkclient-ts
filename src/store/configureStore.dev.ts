// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import * as redux from 'redux';
import {createStore as createStoreRedux, IModule} from 'redux-dynamic-modules-core';
import {offlineConfig} from './helpers';
// eslint-disable-next-line no-duplicate-imports
import {Reducer, Action} from 'redux';
import {GlobalState, SagaStore} from 'types/store';
import deepFreezeAndThrowOnMutation from 'utils/deep_freeze';
import initialState from './initial_state';
import {offline} from '@redux-offline/redux-offline';
import defaultOfflineConfig from '@redux-offline/redux-offline/lib/defaults';
import {createMiddleware} from './middleware';
import {getSagaExtension, SagaExtensionContext} from 'hkredux/saga-modular';
import {getThunkExtension} from 'hkredux/thunkMiddleware';
import {EntitiesModule} from 'modules/reducerModule';
import {enableBatching} from 'types/actions';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function bindMiddlware(offlineConfigMiddleware: any, clientOptions: any) {
    // eslint-disable-next-line no-process-env
    const loadReduxDevtools = process.env.NODE_ENV !== 'test';

    if (loadReduxDevtools) {
        // eslint-disable-next-line global-require
        const {composeWithDevTools} = require('redux-devtools-extension');
        return composeWithDevTools(redux.applyMiddleware(offlineConfigMiddleware, ...createMiddleware(clientOptions)));
    }

    return redux.applyMiddleware(...createMiddleware(clientOptions));
}

export const advancedCombineReducersWithBatchActions = <S>(
    advancedCombineReducers: typeof redux.combineReducers = redux.combineReducers,
) => (reducersMap: redux.ReducersMapObject<S, any>): Reducer<S> => {
        const newReducers = advancedCombineReducers(reducersMap);

        // return newReducers
        return enableBatching(newReducers);
    };

export default function configureServiceStore<S>(
    preloadedState: S,

    // appReducer: any,
    userOfflineConfig: any,

    // getAppReducer: any,
    // clientOptions: any,
    loadedModules: Array<IModule<any>>,
    advancedCombineReducers?: (reducers: redux.ReducersMapObject<S, any>) => Reducer<S>,
) {
    const baseOfflineConfig = Object.assign({}, defaultOfflineConfig, offlineConfig, userOfflineConfig);
    const baseState = Object.assign({}, initialState, preloadedState);

    // const { middleware, enhanceReducer, enhanceStore } = createOffline(baseOfflineConfig)

    // eslint-disable-next-line func-style
    // eslint-disable-next-line func-names
    const storeEnhancerForReduxBatch = (...args: any[]) => {
        // eslint-disable-next-line no-process-env
        const loadReduxDevtools = process.env.NODE_ENV !== 'test';
        let customCompose = redux.compose;

        if (loadReduxDevtools) {
            // eslint-disable-next-line global-require
            const {composeWithDevTools} = require('redux-devtools-extension/developmentOnly');
            customCompose = composeWithDevTools({maxAge: 500});
        }

        // return customCompose(reduxBatch, redux.compose.apply(null, args), reduxBatch)
        return customCompose(redux.compose.apply(null, args));
    };

    const sagaContext: SagaExtensionContext = {};
    const store = createStoreRedux(
        {
            initialState: baseState,
            enhancers: [offline(baseOfflineConfig) as redux.StoreEnhancer<S>],

            // extensions: [getThunkExtension(), getSagaPromiseExtension(), getSagaExtension(sagaContext)],
            extensions: [getThunkExtension(), getSagaExtension(sagaContext)],
            advancedCombineReducers: advancedCombineReducersWithBatchActions(advancedCombineReducers as any),
            advancedComposeEnhancers: storeEnhancerForReduxBatch,
        },
        EntitiesModule,
        ...loadedModules,
    );

    //   {
    //   enhanceReducer(createDevReducer(baseState, serviceReducer, appReducer)),
    //   baseState,
    //   redux.compose(reduxBatch, bindMiddlware(middleware, clientOptions), reduxBatch, enhanceStore)
    // )

    // reducerRegistry.setChangeListener((reducers: any) => {
    //   store.replaceReducer(enhanceReducer(createDevReducer(baseState, reducers)))
    // })

    const sagaStore = store as SagaStore;
    sagaStore.getSagaTasks = sagaContext.sagaManager?.getTasks;

    // launch store persistor
    if (baseOfflineConfig.persist) {
        baseOfflineConfig.persist(store, baseOfflineConfig.persistOptions, baseOfflineConfig.persistCallback);
    }

    // if ((module as any).hot) {
    //   // Enable Webpack hot module replacement for reducers
    //   // eslint-disable-next-line prettier/prettier
    //   (module as any).hot.accept(() => {
    //     const nextServiceReducer = require('../reducers').default // eslint-disable-line global-require
    //     let nextAppReducer
    //     if (getAppReducer) {
    //       nextAppReducer = getAppReducer() // eslint-disable-line global-require
    //     }
    //     store.replaceReducer(
    //       createDevReducer(baseState, reducerRegistry.getReducers(), nextServiceReducer, nextAppReducer)
    //     )
    //   })
    // }

    return store;
}

// function createDevReducer(baseState: any, ...reducers: any) {
//   return enableFreezing(createReducer(baseState, ...reducers))
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function enableFreezing(reducer: Reducer) {
    return (state: GlobalState, action: Action) => {
        const nextState = reducer(state, action);

        if (nextState !== state) {
            deepFreezeAndThrowOnMutation(nextState);
        }

        return nextState;
    };
}

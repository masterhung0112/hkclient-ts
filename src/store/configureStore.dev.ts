import * as redux from 'redux'
import { createStore as createStoreRedux, IModule } from 'redux-dynamic-modules-core'
import { offlineConfig } from './helpers'
import { Reducer, Action } from 'redux'
import { GlobalState } from 'types/store'
import deepFreezeAndThrowOnMutation from 'utils/deep_freeze'
import initialState from './initial_state'
import { offline } from '@redux-offline/redux-offline'
import defaultOfflineConfig from '@redux-offline/redux-offline/lib/defaults'
import { createMiddleware } from './middleware'
import reduxBatch from './reduxBatch'
import { getReduxOfflineExtension } from './offlineExtension'
import { getSagaExtension } from 'saga-modular'
import { getThunkExtension } from 'redux-dynamic-modules-thunk'
import { EntitiesModule } from 'hkmodules/reducerModule'

// const windowAny = window as any

// const devToolsEnhancer =
//   // typeof windowAny !== 'undefined' && windowAny.__REDUX_DEVTOOLS_EXTENSION__ // eslint-disable-line no-underscore-dangle
//     // ? windowAny.__REDUX_DEVTOOLS_EXTENSION__ // eslint-disable-line no-underscore-dangle
//     // :
//     () => {
//         return devTools({
//           name: 'hkclient-ts',
//           hostname: 'localhost',
//           port: 5678,
//           realtime: true,
//         })
//       }

function bindMiddlware(offlineConfigMiddleware: any, clientOptions: any) {
  const loadReduxDevtools = process.env.NODE_ENV !== 'test'

  if (loadReduxDevtools) {
    const { composeWithDevTools } = require('redux-devtools-extension')
    return composeWithDevTools(redux.applyMiddleware(offlineConfigMiddleware, ...createMiddleware(clientOptions)))
  }

  return redux.applyMiddleware(...createMiddleware(clientOptions))
}

export default function configureServiceStore<S>(
  preloadedState: S,
  // appReducer: any,
  userOfflineConfig: any,
  // getAppReducer: any,
  // clientOptions: any,
  loadedModules: IModule<any>[],
  advancedCombineReducers?: (reducers: redux.ReducersMapObject<S, any>) => Reducer<S>
) {
  const baseOfflineConfig = Object.assign({}, defaultOfflineConfig, offlineConfig, userOfflineConfig)
  const baseState = Object.assign({}, initialState, preloadedState)

  // const { middleware, enhanceReducer, enhanceStore } = createOffline(baseOfflineConfig)

  const storeEnhancerForReduxBatch = function (...args) {
    const loadReduxDevtools = process.env.NODE_ENV !== 'test'
    let customCompose = redux.compose

    if (loadReduxDevtools) {
      const { composeWithDevTools } = require('redux-devtools-extension/developmentOnly')
      customCompose = composeWithDevTools({ maxAge: 500 })
    }
    return customCompose(reduxBatch, redux.compose.apply(null, args), reduxBatch)
  }

  const store = createStoreRedux(
    {
      initialState: baseState,
      enhancers: [offline(baseOfflineConfig) as redux.StoreEnhancer<S>, reduxBatch],
      extensions: [getThunkExtension(), getSagaExtension({})],
      advancedCombineReducers: advancedCombineReducers,
      advancedComposeEnhancers: storeEnhancerForReduxBatch as any,
    },
    EntitiesModule,
    ...loadedModules
  )

  //   {
  //   enhanceReducer(createDevReducer(baseState, serviceReducer, appReducer)),
  //   baseState,
  //   redux.compose(reduxBatch, bindMiddlware(middleware, clientOptions), reduxBatch, enhanceStore)
  // )

  // reducerRegistry.setChangeListener((reducers: any) => {
  //   store.replaceReducer(enhanceReducer(createDevReducer(baseState, reducers)))
  // })

  // launch store persistor
  if (baseOfflineConfig.persist) {
    baseOfflineConfig.persist(store, baseOfflineConfig.persistOptions, baseOfflineConfig.persistCallback)
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

  return store
}

// function createDevReducer(baseState: any, ...reducers: any) {
//   return enableFreezing(createReducer(baseState, ...reducers))
// }

function enableFreezing(reducer: Reducer) {
  return (state: GlobalState, action: Action) => {
    const nextState = reducer(state, action)

    if (nextState !== state) {
      deepFreezeAndThrowOnMutation(nextState)
    }

    return nextState
  }
}

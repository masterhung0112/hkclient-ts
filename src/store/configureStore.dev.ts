import * as redux from 'redux'
import { offlineConfig, createReducer } from './helpers'
import { Reducer, Action } from 'redux'
import { GlobalState } from 'types/store'
import deepFreezeAndThrowOnMutation from 'utils/deep_freeze'
import initialState from './initial_state'
import { createOffline } from '@redux-offline/redux-offline'
import defaultOfflineConfig from '@redux-offline/redux-offline/lib/defaults'
import { createMiddleware } from './middleware'
import serviceReducer from '../reducers'
import reducerRegistry from './reducer_registry'

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

export default function configureServiceStore(
  preloadedState: any,
  appReducer: any,
  userOfflineConfig: any,
  getAppReducer: any,
  clientOptions: any
) {
  const baseOfflineConfig = Object.assign({}, defaultOfflineConfig, offlineConfig, userOfflineConfig)
  const baseState = Object.assign({}, initialState, preloadedState)

  const { middleware, enhanceReducer, enhanceStore } = createOffline(baseOfflineConfig)

  // const composeEnhancers = loadReduxDevtools ? devToolsEnhancer() : redux.compose

  const store = redux.createStore(
    enhanceReducer(createDevReducer(baseState, serviceReducer, appReducer)),
    baseState,
    redux.compose(bindMiddlware(middleware, clientOptions), enhanceStore)
  )

  reducerRegistry.setChangeListener((reducers: any) => {
    store.replaceReducer(enhanceReducer(createDevReducer(baseState, reducers)))
  })

  if ((module as any).hot) {
    // Enable Webpack hot module replacement for reducers
    (module as any).hot.accept(() => {
        const nextServiceReducer = require('../reducers').default; // eslint-disable-line global-require
        let nextAppReducer;
        if (getAppReducer) {
            nextAppReducer = getAppReducer(); // eslint-disable-line global-require
        }
        store.replaceReducer(createDevReducer(baseState, reducerRegistry.getReducers(), nextServiceReducer, nextAppReducer));
    });
  }

  return store
}

function createDevReducer(baseState: any, ...reducers: any) {
  return enableFreezing(createReducer(baseState, ...reducers))
}

function enableFreezing(reducer: Reducer) {
  return (state: GlobalState, action: Action) => {
    const nextState = reducer(state, action)

    if (nextState !== state) {
      deepFreezeAndThrowOnMutation(nextState)
    }

    return nextState
  }
}

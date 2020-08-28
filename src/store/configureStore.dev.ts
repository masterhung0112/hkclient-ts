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
import devTools from 'remote-redux-devtools'
import reducerRegistry from './reducer_registry'

const windowAny = window as any

const devToolsEnhancer =
  typeof windowAny !== 'undefined' && windowAny.__REDUX_DEVTOOLS_EXTENSION__ // eslint-disable-line no-underscore-dangle
    ? windowAny.__REDUX_DEVTOOLS_EXTENSION__ // eslint-disable-line no-underscore-dangle
    : () => {
        return devTools({
          name: 'Mattermost',
          hostname: 'localhost',
          port: 5678,
          realtime: true,
        })
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

  const loadReduxDevtools = process.env.NODE_ENV !== 'test'
  const { middleware, enhanceReducer, enhanceStore } = createOffline(baseOfflineConfig)

  const composeEnhancers = loadReduxDevtools ? devToolsEnhancer() : redux.compose

  const store = redux.createStore(
    enhanceReducer(createDevReducer(baseState, serviceReducer, appReducer)),
    baseState,
    composeEnhancers(redux.applyMiddleware(middleware, ...createMiddleware(clientOptions)), enhanceStore)
  )

  reducerRegistry.setChangeListener((reducers: any) => {
    store.replaceReducer(enhanceReducer(createDevReducer(baseState, reducers)))
  })

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

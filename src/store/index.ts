import { Config } from '@redux-offline/redux-offline/lib/types'
import { Reducer, ReducersMapObject } from 'redux'
import { IModule, IModuleStore } from 'redux-dynamic-modules-core'

/* eslint-disable @typescript-eslint/no-var-requires */
const config: <S>(
  preloadedState: S,
  userOfflineConfig: Partial<Config>,
  loadedModules: IModule<any>[],
  advancedCombineReducers?: (reducers: ReducersMapObject<S, any>) => Reducer<S>
) => IModuleStore<S> =
  process.env.NODE_ENV === 'production'
    ? require('./configureStore.dev').default
    : require('./configureStore.dev').default
export default config

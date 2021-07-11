// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {Config} from '@redux-offline/redux-offline/lib/types';
import {Reducer, ReducersMapObject} from 'redux';
import {IModule, IModuleStore} from 'redux-dynamic-modules-core';

/* eslint-disable @typescript-eslint/no-var-requires */
const config: <S>(
  preloadedState: S,
  userOfflineConfig: Partial<Config>,
  loadedModules: Array<IModule<any>>,
  advancedCombineReducers?: (reducers: ReducersMapObject<S, any>) => Reducer<S>
) => IModuleStore<S> =

  // process.env.NODE_ENV === 'production'
  //   ? require('./configureStore.dev').default
  require('./configureStore.dev').default;
export default config;

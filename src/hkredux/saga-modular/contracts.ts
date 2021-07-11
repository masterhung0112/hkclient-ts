// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {IModule, IItemManager} from 'redux-dynamic-modules-core';
import {Task} from 'redux-saga';

export interface ISagaWithArguments<T> {
  saga: (argument?: T) => Iterator<any>;
  argument?: T;
}
export type ISagaRegistration<T> = (() => Iterator<any>) | ISagaWithArguments<T>

export interface ISagaModule<T> extends IModule<T> {
  sagas?: Array<ISagaRegistration<any>>;
}

export interface ISagaItemManager<T> extends IItemManager<T> {
  getTasks: () => Task[];
}

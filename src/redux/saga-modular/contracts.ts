import { IModule, IItemManager } from 'redux-dynamic-modules-core'
import { Task } from 'redux-saga'

export interface ISagaWithArguments<T> {
  saga: (argument?: T) => Iterator<any>
  argument?: T
}
export type ISagaRegistration<T> = (() => Iterator<any>) | ISagaWithArguments<T>

export interface ISagaModule<T> extends IModule<T> {
  sagas?: ISagaRegistration<any>[]
}

export interface ISagaItemManager<T> extends IItemManager<T> {
  getTasks: () => Task[]
}

import { IExtension } from 'redux-dynamic-modules-core'
import { Saga, SagaIterator } from 'redux-saga'
import { call, cancelled } from 'redux-saga/effects'
import { Action } from 'types/actions'

export const DEFERRED = Symbol('DEFERRED')

const createExposedPromise = () => {
  const deferred: {
    resolve: any
    reject: any
  } = {
    resolve: undefined,
    reject: undefined,
  }

  const promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve
    deferred.reject = reject
  })

  return [promise, deferred]
}

const sagaPromiseMiddleware = (store) => (next) => (action) => {
  const [promise, deferred] = createExposedPromise()
  next({ ...action, [DEFERRED]: deferred })
  return promise
}
export default sagaPromiseMiddleware

export function getSagaPromiseExtension(): IExtension {
  return {
    middleware: [sagaPromiseMiddleware],
  }
}

export function withPromise(saga: Saga): Saga {
  return function* ({ [DEFERRED]: deferred, ...action }): SagaIterator {
    let error = undefined
    let data = undefined
    try {
      data = yield call(saga, ...action)
    } catch (err) {
      error = err
      deferred.reject(error)
    } finally {
      if (yield cancelled()) {
        deferred.reject(new Error('cancelled'))
      }
    }

    deferred.resolve(data)
  }
}

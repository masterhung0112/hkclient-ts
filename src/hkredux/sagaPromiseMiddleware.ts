// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {IExtension} from 'redux-dynamic-modules-core';
import {Saga, SagaIterator} from 'redux-saga';
import {call, cancelled} from 'redux-saga/effects';

export const DEFERRED = Symbol('DEFERRED');

const createExposedPromise = () => {
    const deferred: {
    resolve: any;
    reject: any;
  } = {
      resolve: undefined,
      reject: undefined,
  };

    const promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });

    return [promise, deferred];
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const sagaPromiseMiddleware = () => (next: any) => (action: any) => {
    const [promise, deferred] = createExposedPromise();

    // console.log('call action', typeof action, typeof action === 'function' ? 'nothing' : action)

    if (typeof action === 'function') {
        next(action);
    } else if (Array.isArray(action)) {
        next(action.map((a) => ({...a, [DEFERRED]: deferred})));
    } else {
        next({...action, [DEFERRED]: deferred});
    }
    return promise;
};
export default sagaPromiseMiddleware;

export function getSagaPromiseExtension(): IExtension {
    return {
        middleware: [sagaPromiseMiddleware],
    };
}

export function withPromise(saga: Saga, ...sagaArgs: any): Saga {
    // eslint-disable-next-line func-names
    return function* ({[DEFERRED]: deferred, ...action}): SagaIterator {
        let error;
        let data;
        try {
            data = yield call(saga, ...sagaArgs, action);
        } catch (err) {
            error = err;
            if (deferred) {
                deferred.reject(error);
            }
        } finally {
            if (yield cancelled()) {
                if (deferred) {
                    deferred.reject(new Error('cancelled'));
                }
            }
        }

        if (deferred) {
            deferred.resolve(data);
        }
    };
}

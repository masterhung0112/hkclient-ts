// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {ISagaItemManager, ISagaRegistration, ISagaWithArguments} from './contracts';
import {SagaMiddleware, Task} from 'redux-saga';
import {sagaEquals} from './sagaComparer';
import {getMap} from 'redux-dynamic-modules-core';

/**
 * Creates saga items which can be used to start and stop sagas dynamically
 */
export function getSagaManager(sagaMiddleware: SagaMiddleware<any>): ISagaItemManager<ISagaRegistration<any>> {
    const tasks = getMap<ISagaRegistration<any>, Task>(sagaEquals);

    return {
        getTasks: (): Task[] => {
            const taskArr: Task[] = [];
            tasks.keys.forEach((k) => taskArr.push(tasks.get(k)));
            return taskArr;
        },
        getItems: (): Array<ISagaRegistration<any>> => [...tasks.keys],
        add: (sagas: Array<ISagaRegistration<any>>) => {
            if (!sagas) {
                return;
            }
            sagas.forEach((saga) => {
                if (saga && !tasks.get(saga)) {
                    tasks.add(saga, runSaga(sagaMiddleware, saga));
                }
            });
        },
        remove: (sagas: Array<ISagaRegistration<any>>) => {
            if (!sagas) {
                return;
            }
            sagas.forEach((saga) => {
                if (tasks.get(saga)) {
                    const task = tasks.remove(saga);
                    task.cancel();
                }
            });
        },
        dispose: () => {
            // Cancel everything
            tasks.keys.forEach((k) => tasks.get(k).cancel());
        },
    };
}

function runSaga(sagaMiddleware: SagaMiddleware<any>, sagaRegistration: ISagaRegistration<any>): Task {
    if (typeof sagaRegistration === 'function') {
        const saga = sagaRegistration as () => Iterator<any>;
        return sagaMiddleware.run(saga);
    }
    const saga = (sagaRegistration as ISagaWithArguments<any>).saga;
    const argument = (sagaRegistration as ISagaWithArguments<any>).argument;
    return sagaMiddleware.run(saga, argument);
}

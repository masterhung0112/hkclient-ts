// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {put, select, takeEvery, takeLatest} from 'redux-saga/effects';

import CounterActions from '../actions/counter';
import {CounterTypes} from '../action_types';
import {countSelector} from '../selectors/entities/counter';

function* incrementWorker() {
    let count = yield select(countSelector);

    count += 1;

    yield put(CounterActions.setCount(count));
}

function* decrementWatcher() {
    let count = yield select(countSelector);

    count -= 1;

    if (count >= 0) {
        yield put(CounterActions.setCount(count));
    }
}

function* resetWatcher() {
    yield put(CounterActions.setCount(0));
}

export function* countWatcher() {
    yield takeEvery(CounterTypes.INCREMENT, incrementWorker);
    yield takeEvery(CounterTypes.DECREMENT, decrementWatcher);
    yield takeLatest(CounterTypes.RESET, resetWatcher);
}

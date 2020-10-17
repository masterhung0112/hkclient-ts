import { put, select, takeEvery, takeLatest } from 'redux-saga/effects'

import { CounterActions } from '../../actions'
import { CounterTypes } from '../../action-types'
import { countSelector } from './selectors'

function* incrementWorker() {
  let count = yield select(countSelector)

  count += 1

  yield put(CounterActions.setCount(count))
}

function* decrementWatcher() {
  let count = yield select(countSelector)

  count -= 1

  if (count >= 0) {
    yield put(CounterActions.setCount(count))
  }
}

function* resetWatcher() {
  yield put(CounterActions.setCount(0))
}

export function* countWatcher() {
  yield takeEvery(CounterTypes.INCREMENT, incrementWorker)
  yield takeEvery(CounterTypes.DECREMENT, decrementWatcher)
  yield takeLatest(CounterTypes.RESET, resetWatcher)
}

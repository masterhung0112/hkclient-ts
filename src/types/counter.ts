import CounterConstants from 'constants/counter'

export interface CountAwareState {
  [CounterConstants.COUNT_MODULE_NAME]: CountState
}

export type CountState = Readonly<{
  count: number
}>

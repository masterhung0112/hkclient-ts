import { COUNT_MODULE_NAME } from '../modules/counter/constants'

export interface CountAwareState {
  [COUNT_MODULE_NAME]: CountState
}

export type CountState = Readonly<{
  count: number
}>

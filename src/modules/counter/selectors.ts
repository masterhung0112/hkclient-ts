import { CountAwareState } from '../../state'
import { COUNT_MODULE_NAME } from './constants'

export const countSelector = (state: CountAwareState): number => {
  return state[COUNT_MODULE_NAME].count
}

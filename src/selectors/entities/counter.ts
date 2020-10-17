import { CountAwareState } from '../../state'
import { CounterConstants } from 'constants/counter'

export const countSelector = (state: CountAwareState): number => {
  return state[CounterConstants.COUNT_MODULE_NAME].count
}

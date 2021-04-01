import { CountAwareState } from 'types/counter'
import CounterConstants from 'hkconstants/counter'

export const countSelector = (state: CountAwareState): number => {
  return state[CounterConstants.COUNT_MODULE_NAME].count
}

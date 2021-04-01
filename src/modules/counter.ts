import { CountAwareState } from 'types/counter'
import { countReducer } from 'hkreducers/entities/counter'
import { countWatcher } from 'hksagas/counter'
import { ISagaModule } from 'saga-modular/contracts'
import CounterConstants from 'hkconstants/counter'

export const CountModule: ISagaModule<CountAwareState> = {
  id: CounterConstants.COUNT_MODULE_NAME,
  reducerMap: {
    [CounterConstants.COUNT_MODULE_NAME]: countReducer,
  },
  sagas: [countWatcher],
}

import userReducer from 'hkreducers/entities/users'
import { USERS_MODULE_NAME } from 'hkconstants/users'
import { UsersAwareState } from 'types/users'
import { ISagaModule } from 'saga-modular/contracts'
import { watchUsers } from 'hksagas/users'

export const UsersModule: ISagaModule<UsersAwareState> = {
  id: USERS_MODULE_NAME,
  reducerMap: {
    [USERS_MODULE_NAME]: userReducer,
  },
  sagas: [watchUsers],
}

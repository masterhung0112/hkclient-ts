import userReducer from 'hkreducers/entities/users'
import { USERS_MODULE_NAME } from 'hkconstants/users'
import { UsersAwareState } from 'types/users'
import { IModule } from 'redux-dynamic-modules-core'

export const UsersModule: IModule<UsersAwareState> = {
  id: USERS_MODULE_NAME,
  reducerMap: {
    [USERS_MODULE_NAME]: userReducer,
  },
}

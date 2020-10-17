import userReducer from 'hkreducers/entities/users'
import { UsersConstants } from 'hkconstants/users'
import { UsersAwareState } from 'types/users'
import { IModule } from 'redux-dynamic-modules-core'

export const UsersModule: IModule<UsersAwareState> = {
  id: UsersConstants.USERS_MODULE_NAME,
  reducerMap: {
    [UsersConstants.USERS_MODULE_NAME]: userReducer,
  },
}

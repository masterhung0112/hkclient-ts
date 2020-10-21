import userReducer from 'hkreducers/entities/users'
import { USERS_MODULE_NAME } from 'hkconstants/users'
import { UsersAwareState } from 'types/users'
import { IModule } from 'redux-dynamic-modules-core'
import { GeneralModule } from './general'

export const UsersModule: IModule<UsersAwareState> = {
  id: USERS_MODULE_NAME,
  reducerMap: {
    [USERS_MODULE_NAME]: userReducer,
  },
}

export function getUsersModuleDependencies(): IModule<any>[] {
  return [GeneralModule]
}

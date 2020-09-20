import { UsersState } from './users'
import { GeneralState } from './general'
import { TeamsState } from './teams'
import { Role } from './roles'
import { ChannelsState } from './channels'

export type GlobalState = {
  entities: {
    general: GeneralState
    users: UsersState
    teams: TeamsState
    channels: ChannelsState
    roles: {
      roles: {
        [x: string]: Role
      }
      pending: Set<string>
    }
  }
  // errors: Array<any>
}

import { UsersAwareState, UsersState } from './users'
import { GeneralState } from './general'
import { TeamsState } from './teams'
import { Role } from './roles'
import { ChannelsState } from './channels'

export type EntitiesState = {
  general: GeneralState
  users: UsersState
  teams: TeamsState
  channels: ChannelsState
  roles: {
    roles: {
      [x: string]: Role
    }
    pending: string[]
  }
}

export interface GlobalState {
  entities: EntitiesState
  // errors: Array<any>
}

import { GeneralAwareState, GeneralState } from './general'
import { TeamsState } from './teams'
import { Role } from './roles'
import { ChannelsState } from './channels'
import { UsersAwareState } from './users'

export type EntitiesState = {
  teams: TeamsState
  channels: ChannelsState
  roles: {
    roles: {
      [x: string]: Role
    }
    pending: string[]
  }
}

export interface GlobalState extends UsersAwareState, GeneralAwareState {
  entities: EntitiesState
  // errors: Array<any>
}

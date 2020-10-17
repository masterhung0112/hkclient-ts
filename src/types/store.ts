import { GeneralState } from './general'
import { TeamsState } from './teams'
import { Role } from './roles'
import { ChannelsState } from './channels'
import { UsersAwareState } from './users'

export type EntitiesState = {
  general: GeneralState
  teams: TeamsState
  channels: ChannelsState
  roles: {
    roles: {
      [x: string]: Role
    }
    pending: string[]
  }
}

export interface GlobalState extends UsersAwareState {
  entities: EntitiesState
  // errors: Array<any>
}

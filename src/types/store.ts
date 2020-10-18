import { GeneralState } from './general'
import { TeamsState } from './teams'
import { Role } from './roles'
import { ChannelsState } from './channels'
import { UsersAwareState } from './users'
import { Store } from 'redux'
import { Task } from 'redux-saga'

export interface SagaStore extends Store {
  getSagaTasks?: () => Task[]
}

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

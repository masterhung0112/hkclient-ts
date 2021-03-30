import { GeneralAwareState, GeneralState } from './general'
import { TeamsState } from './teams'
import { Role } from './roles'
import { ChannelsState } from './channels'
import { UsersAwareState } from './users'
import { Store } from 'redux'
import { Task } from 'redux-saga'
import { AdminState } from './admin'
import { AppsState } from './apps'
import { Bot } from './bots'
import { ChannelCategoriesState } from './channel_categories'
import { CloudState } from './cloud'
import { EmojisState } from './emojis'
import { FilesState } from './files'
import { GroupsState } from './groups'
import { IntegrationsState } from './integrations'
import { JobsState } from './jobs'
import { PostsState } from './posts'
import { PreferenceType } from './preferences'
import { SchemesState } from './schemes'
import { SearchState } from './search'
import { ThreadsState } from './threads'
import { Typing } from './typing'
import { Dictionary } from './utilities'
import {
  ChannelsRequestsStatuses,
  GeneralRequestsStatuses,
  PostsRequestsStatuses,
  TeamsRequestsStatuses,
  UsersRequestsStatuses,
  AdminRequestsStatuses,
  FilesRequestsStatuses,
  RolesRequestsStatuses,
  JobsRequestsStatuses,
} from './requests'

export interface cd extends Store {
  getSagaTasks?: () => Task[]
}

export interface EntitiesState extends UsersAwareState {
  general: GeneralState
  teams: TeamsState
  channels: ChannelsState
  posts: PostsState
  threads: ThreadsState
  bots: {
    accounts: Dictionary<Bot>
  }
  preferences: {
    myPreferences: {
      [x: string]: PreferenceType
    }
  }
  admin: AdminState
  jobs: JobsState
  search: SearchState
  integrations: IntegrationsState
  files: FilesState
  emojis: EmojisState
  typing: Typing
  roles: {
    roles: {
      [x: string]: Role
    }
    pending: Set<string>
  }
  schemes: SchemesState
  gifs: any
  groups: GroupsState
  channelCategories: ChannelCategoriesState
  apps: AppsState
  cloud: CloudState
}

export interface GlobalState {
  entities: EntitiesState
  errors: any[]
  requests: {
    channels: ChannelsRequestsStatuses
    general: GeneralRequestsStatuses
    posts: PostsRequestsStatuses
    teams: TeamsRequestsStatuses
    users: UsersRequestsStatuses
    admin: AdminRequestsStatuses
    files: FilesRequestsStatuses
    roles: RolesRequestsStatuses
    jobs: JobsRequestsStatuses
  }
  websocket: {
    connected: boolean
    lastConnectAt: number
    lastDisconnectAt: number
  }
}

export interface SagaStore extends Store {
  getSagaTasks?: () => Task[]
}

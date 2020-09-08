import { GlobalState } from 'types/store'

const state: GlobalState = {
  entities: {
    general: {
      // appState: false,
      // credentials: {},
      config: {},
      serverVersion: '',
    },
    users: {
      currentUserId: '',
      profiles: {},
    },
    teams: {
      currentTeamId: '',
      teams: {},
      myMembers: {}
    },
    roles: {
      roles: {},
      pending: new Set(),
    }
  },
  // errors: [],
}

export default state

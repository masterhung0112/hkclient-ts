import { GlobalState } from 'types/store'

const state: GlobalState = {
  entities: {
    general: {
      // appState: false,
      // credentials: {},
      config: {},
    },
    users: {
      currentUserId: '',
      profiles: {},
    },
    teams: {
      currentTeamId: '',
      teams: {},
      myMembers: {}
    }
  },
  // errors: [],
}

export default state

import { GlobalState } from 'types/store'

const state: Partial<GlobalState> = {
  entities: {
    general: {
      // appState: false,
      // credentials: {},
      config: {},
      license: {},
      deviceToken: '',
      serverVersion: '',
    },
    teams: {
      currentTeamId: '',
      teams: {},
      myMembers: {},
    },
    channels: {
      currentChannelId: '',
      channels: {},
      channelsInTeam: {},
      myMembers: {},
      membersInChannel: {},
      stats: {},
      groupsAssociatedToChannel: {},
      totalCount: 0,
      manuallyUnread: {},
      channelModerations: {},
      channelMemberCountsByGroup: {},
    },
    roles: {
      roles: {},
      pending: [],
    },
  },
  // errors: [],
}

export default state

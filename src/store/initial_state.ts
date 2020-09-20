import { GlobalState } from 'types/store'

const state: GlobalState = {
  entities: {
    general: {
      // appState: false,
      // credentials: {},
      config: {},
      license: {},
      deviceToken: '',
      serverVersion: '',
    },
    users: {
      currentUserId: '',
      profiles: {},
      statuses: {},
      profilesInChannel: {},
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
      pending: new Set(),
    },
  },
  // errors: [],
}

export default state

import { GlobalState } from 'types/store'

const state: Partial<GlobalState> = {
  entities: {
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

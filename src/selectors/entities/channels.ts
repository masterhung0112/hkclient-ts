import { GlobalState } from 'types/store'
import { NameMappedObjects, RelationOneToMany, IDMappedObjects, RelationOneToOne } from 'types/utilities'
import { Channel, ChannelMembership } from 'types/channels'
import { createSelector } from 'reselect'
import { Team } from 'types/teams'
import { UsersState, UserProfile } from 'types/users'
import { getTeammateNameDisplaySetting } from './preferences'
import { completeDirectChannelInfo, sortChannelsByDisplayName } from 'utils/channel_utils'
import { General, Permissions } from '../../constants'
import { getMyTeams } from './teams'
import { getCurrentUser } from '../users'
import { hasNewPermissions } from './general'
import { getMyChannelMemberships } from '../common'
import { haveITeamPermission } from './roles'

export function getAllChannels(state: GlobalState): IDMappedObjects<Channel> {
  return state.entities.channels.channels
}

export function getChannelsInTeam(state: GlobalState): RelationOneToMany<Team, Channel> {
  return state.entities.channels.channelsInTeam
}

export const getChannelsNameMapInTeam: (
  state: GlobalState,
  teamId: string
) => NameMappedObjects<Channel> = createSelector(
  getAllChannels,
  getChannelsInTeam,
  (state: GlobalState, teamId: string): string => teamId,
  (
    channels: IDMappedObjects<Channel>,
    channelsInTeams: RelationOneToMany<Team, Channel>,
    teamId: string
  ): NameMappedObjects<Channel> => {
    const channelsInTeam = channelsInTeams[teamId] || []
    const channelMap: NameMappedObjects<Channel> = {}
    channelsInTeam.forEach((id) => {
      const channel = channels[id]
      channelMap[channel.name] = channel
    })
    return channelMap
  }
)

export const getDirectChannelsSet: (state: GlobalState) => Set<string> = createSelector(
  getChannelsInTeam,
  (channelsInTeam: RelationOneToMany<Team, Channel>): Set<string> => {
    if (!channelsInTeam) {
      return new Set()
    }

    return new Set(channelsInTeam[''])
  }
)

// Returns both DMs and GMs
export const getAllDirectChannels: (state: GlobalState) => Array<Channel> = createSelector(
  getAllChannels,
  getDirectChannelsSet,
  (state: GlobalState): UsersState => state.entities.users,
  getTeammateNameDisplaySetting,
  (
    channels: IDMappedObjects<Channel>,
    channelSet: Set<string>,
    users: UsersState,
    teammateNameDisplay: string
  ): Array<Channel> => {
    const dmChannels: Channel[] = []
    channelSet.forEach((c) => {
      dmChannels.push(completeDirectChannelInfo(users, teammateNameDisplay, channels[c]))
    })
    return dmChannels
  }
)

export const getDefaultChannelForTeams: (state: GlobalState) => RelationOneToOne<Team, Channel> = createSelector(
  getAllChannels,
  (channels: IDMappedObjects<Channel>): RelationOneToOne<Team, Channel> => {
    const result: RelationOneToOne<Team, Channel> = {}

    for (const channel of Object.keys(channels).map((key) => channels[key])) {
      if (channel && channel.name === General.DEFAULT_CHANNEL) {
        result[channel.team_id] = channel
      }
    }

    return result
  }
)

export const getMyFirstChannelForTeams: (state: GlobalState) => RelationOneToOne<Team, Channel> = createSelector(
  getAllChannels,
  getMyChannelMemberships,
  getMyTeams,
  getCurrentUser,
  (
    allChannels: IDMappedObjects<Channel>,
    myChannelMemberships: RelationOneToOne<Channel, ChannelMembership>,
    myTeams: Array<Team>,
    currentUser: UserProfile
  ): RelationOneToOne<Team, Channel> => {
    const locale = currentUser.locale || General.DEFAULT_LOCALE
    const result: RelationOneToOne<Team, Channel> = {}

    for (const team of myTeams) {
      // Get a sorted array of all channels in the team that the current user is a member of
      const teamChannels = Object.values(allChannels)
        .filter(
          (channel: Channel) => channel && channel.team_id === team.id && Boolean(myChannelMemberships[channel.id])
        )
        .sort(sortChannelsByDisplayName.bind(null, locale))

      if (teamChannels.length === 0) {
        continue
      }

      result[team.id] = teamChannels[0]
    }

    return result
  }
)

export const getRedirectChannelNameForTeam = (state: GlobalState, teamId: string): string => {
  const defaultChannelForTeam = getDefaultChannelForTeams(state)[teamId]
  const myFirstChannelForTeam = getMyFirstChannelForTeams(state)[teamId]
  const canIJoinPublicChannelsInTeam =
    !hasNewPermissions(state) ||
    haveITeamPermission(state, {
      team: teamId,
      permission: Permissions.JOIN_PUBLIC_CHANNELS,
    })
  const myChannelMemberships = getMyChannelMemberships(state)
  const iAmMemberOfTheTeamDefaultChannel = Boolean(
    defaultChannelForTeam && myChannelMemberships[defaultChannelForTeam.id]
  )

  if (iAmMemberOfTheTeamDefaultChannel || canIJoinPublicChannelsInTeam) {
    return General.DEFAULT_CHANNEL
  }

  return (myFirstChannelForTeam && myFirstChannelForTeam.name) || General.DEFAULT_CHANNEL
}

export const getMyChannelMember: (
  state: GlobalState,
  channelId: string
) => ChannelMembership | undefined | null = createSelector(
  getMyChannelMemberships,
  (state: GlobalState, channelId: string): string => channelId,
  (
    channelMemberships: RelationOneToOne<Channel, ChannelMembership>,
    channelId: string
  ): ChannelMembership | undefined | null => {
    return channelMemberships[channelId] || null
  }
)

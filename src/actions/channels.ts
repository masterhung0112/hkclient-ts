import { ActionFunc, DispatchFunc, GetStateFunc, Action } from 'types/actions'
import { isMinimumServerVersion } from 'utils/helpers'
import { forceLogoutIfNecessary, bindClientFunc } from './helpers'
import { logError } from './errors'
import { loadRolesIfNeeded } from './roles'
import { HkClient } from 'hkclient'
import { ChannelTypes } from 'action-types'
import { getChannelsIdForTeam } from 'utils/channel_utils'
import { getServerVersion } from 'selectors/general'
import { getCurrentUserId } from 'selectors/users'

export function selectChannel(channelId: string): Action {
  return {
    type: ChannelTypes.SELECT_CHANNEL,
    data: channelId,
  }
}

export function fetchMyChannelsAndMembers(teamId: string): ActionFunc {
  return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
    dispatch({
      type: ChannelTypes.CHANNELS_REQUEST,
      data: null,
    })

    let channels
    let channelMembers
    const state = getState()
    const shouldFetchArchived = isMinimumServerVersion(getServerVersion(state), 5, 21)
    try {
      const channelRequest = HkClient.getMyChannels(teamId, shouldFetchArchived)
      const memberRequest = HkClient.getMyChannelMembers(teamId)
      channels = await channelRequest
      channelMembers = await memberRequest
    } catch (error) {
      forceLogoutIfNecessary(error, dispatch, getState)
      dispatch([{ type: ChannelTypes.CHANNELS_FAILURE, error }, logError(error)])
      return [{ error }]
    }

    const currentUserId = getCurrentUserId(state)
    const { currentChannelId } = state.entities.channels

    dispatch([
      {
        type: ChannelTypes.RECEIVED_CHANNELS,
        teamId,
        data: channels,
        currentChannelId,
      },
      {
        type: ChannelTypes.CHANNELS_SUCCESS,
      },
      {
        type: ChannelTypes.RECEIVED_MY_CHANNEL_MEMBERS,
        data: channelMembers,
        sync: !shouldFetchArchived,
        channels,
        remove: getChannelsIdForTeam(state, teamId),
        currentUserId,
        currentChannelId,
      },
    ])
    const roles = new Set<string>()
    for (const member of channelMembers) {
      for (const role of member.roles.split(' ')) {
        roles.add(role)
      }
    }
    if (roles.size > 0) {
      dispatch(loadRolesIfNeeded(roles))
    }

    return [{ data: { channels, members: channelMembers } }]
  }
}

export function getMyChannelMember(channelId: string): ActionFunc {
  return bindClientFunc({
    clientFunc: HkClient.getMyChannelMember,
    onSuccess: ChannelTypes.RECEIVED_MY_CHANNEL_MEMBER,
    params: [channelId],
  })
}

export function getChannelByNameAndTeamName(teamName: string, channelName: string, includeDeleted = false): ActionFunc {
  return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
    let data
    try {
      data = await HkClient.getChannelByNameAndTeamName(teamName, channelName, includeDeleted)
    } catch (error) {
      forceLogoutIfNecessary(error, dispatch, getState)
      dispatch([{ type: ChannelTypes.CHANNELS_FAILURE, error }, logError(error)])
      return [{ error }]
    }

    dispatch({
      type: ChannelTypes.RECEIVED_CHANNEL,
      data,
    })

    return [{ data }]
  }
}

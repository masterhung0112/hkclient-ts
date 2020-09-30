import { ActionFunc } from 'types/actions'
import { bindClientFunc } from './helpers'
import { HkClient } from 'hkclient'
import { TeamTypes } from 'action-types'

export function getTeamInviteInfo(inviteId: string): ActionFunc {
  return bindClientFunc({
    clientFunc: HkClient.getTeamInviteInfo,
    onRequest: TeamTypes.TEAM_INVITE_INFO_REQUEST,
    onSuccess: TeamTypes.TEAM_INVITE_INFO_SUCCESS,
    onFailure: TeamTypes.TEAM_INVITE_INFO_FAILURE,
    params: [inviteId],
  })
}

import { Action, ActionFunc, DispatchFunc, GetStateFunc } from 'types/actions'
import { HkClient } from 'hkclient'
import { getConfig } from 'selectors/general'
import { UserTypes } from 'action-types'
import { bindClientFunc, forceLogoutIfNecessary } from './helpers'
import { getMyPreferences } from './preferences'
import { loadRolesIfNeeded } from './roles'
import { UserProfile } from 'types/users'
import { logError } from './errors'
import { getCurrentUser, getCurrentUserId } from 'selectors/users'
import { General } from 'hkconstants'
import { GeneralSelectors } from 'selectors'

export function loadMe(): Action {
  return {
    type: UserTypes.GET_ME,
  }
}
// export function loadMe(): ActionFunc {
//   return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
//     const state = getState()
//     const config = getConfig(state)

//     //TODO: Open this
//     // const deviceId = state.entities.general.deviceToken;
//     // if (deviceId) {
//     //     HkClient.attachDevice(deviceId);
//     // }

//     const promises = [
//       dispatch(getMe()),
//       dispatch(getMyPreferences()),
//       // dispatch(getMyTeams()),
//       // dispatch(getMyTeamMembers()),
//       // dispatch(getMyTeamUnreads()),
//     ]

//     // Sometimes the server version is set in one or the other
//     //TODO: Open this
//     // const serverVersion = HkClient.serverVersion || getState().entities.general.serverVersion;
//     // dispatch(setServerVersion(serverVersion));
//     // if (!isMinimumServerVersion(serverVersion, 4, 7) && config.EnableCustomEmoji === 'true') {
//     // dispatch(getAllCustomEmojis());
//     // }

//     await Promise.all(promises)

//     const currentUserId = getCurrentUserId(getState())
//     const user = getCurrentUser(getState())
//     if (currentUserId) {
//       HkClient.userId = currentUserId
//     }

//     if (user) {
//       HkClient.userRoles = user.roles
//     }

//     return [{ data: true }]
//   }
// }

export function getMe(): Action {
  return {
    type: UserTypes.GET_ME,
  }
}

// export function getMe(): ActionFunc {
//   return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
//     const getMeFunc = bindClientFunc({
//       clientFunc: HkClient.getMe,
//       onSuccess: UserTypes.RECEIVED_ME,
//     })
//     const me = await getMeFunc(dispatch, getState)

//     if (me && 'error' in me[0]) {
//       return me
//     }
//     if (me && 'data' in me[0]) {
//       dispatch(loadRolesIfNeeded(me[0].data.roles.split(' ')))
//     }
//     return me
//   }
// }

// export function getUserByUsername(username: string): ActionFunc {
//   return bindClientFunc({
//     clientFunc: HkClient.getUserByUsername,
//     onSuccess: UserTypes.RECEIVED_PROFILE,
//     params: [username],
//   })
// }

export function getUserByUsername(username: string): Action {
  return {
    type: UserTypes.GET_USER_BY_USERNAME,
    username,
  }
}

// export function getUserByEmail(email: string): ActionFunc {
//   return bindClientFunc({
//     clientFunc: HkClient.getUserByEmail,
//     onSuccess: UserTypes.RECEIVED_PROFILE,
//     params: [email],
//   })
// }

export function getUserByEmail(email: string): Action {
  return {
    type: UserTypes.GET_USER_BY_EMAIL,
    email,
  }
}

export function createUser(user: UserProfile, token: string, inviteId: string, redirect: string): ActionFunc {
  return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
    let created

    try {
      created = await HkClient.createUser(user, token, inviteId, redirect)
    } catch (error) {
      forceLogoutIfNecessary(error, dispatch, getState)
      dispatch(logError(error))
      return [{ error }]
    }

    const profiles: {
      [userId: string]: UserProfile
    } = {
      [created.id]: created,
    }
    dispatch({ type: UserTypes.RECEIVED_PROFILES, data: profiles })

    return [{ data: created }]
  }
}

export function loginById(id: string, password: string, mfaToken = ''): ActionFunc {
  return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
    dispatch({ type: UserTypes.LOGIN_REQUEST, data: null })

    const deviceId = GeneralSelectors.getDeviceToken(getState())
    let data

    try {
      data = await HkClient.loginById(id, password, mfaToken, deviceId)
    } catch (error) {
      dispatch([
        {
          type: UserTypes.LOGIN_FAILURE,
          error,
        },
        logError(error),
      ])
      return [{ error }]
    }

    return completeLogin(data)(dispatch, getState)
  }
}

function completeLogin(data: UserProfile): ActionFunc {
  return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
    dispatch({
      type: UserTypes.RECEIVED_ME,
      data,
    })

    HkClient.userId = data.id
    HkClient.userRoles = data.roles
    let teamMembers

    //TODO: Open
    // try {
    //     const membersRequest: Promise<Array<TeamMembership>> = HkClient.getMyTeamMembers();
    //     const unreadsRequest = HkClient.getMyTeamUnreads();

    //     teamMembers = await membersRequest;
    //     const teamUnreads = await unreadsRequest;

    //     if (teamUnreads) {
    //         for (const u of teamUnreads) {
    //             const index = teamMembers.findIndex((m) => m.team_id === u.team_id);
    //             const member = teamMembers[index];
    //             member.mention_count = u.mention_count;
    //             member.msg_count = u.msg_count;
    //         }
    //     }
    // } catch (error) {
    //     dispatch(batchActions([
    //         {type: UserTypes.LOGIN_FAILURE, error},
    //         logError(error),
    //     ]));
    //     return {error};
    // }

    const promises = [
      dispatch(getMyPreferences()),
      //TODO: Open
      // dispatch(getMyTeams()),
      // dispatch(getClientConfig()),
    ]

    //TODO: Open
    // const serverVersion = HkClient.serverVersion;
    // dispatch(setServerVersion(serverVersion));

    //TODO: Open
    // if (getConfig(getState()).EnableCustomEmoji === 'true') {
    //     dispatch(getAllCustomEmojis());
    // }

    try {
      await Promise.all(promises)
    } catch (error) {
      dispatch([{ type: UserTypes.LOGIN_FAILURE, error }, logError(error)])
      return [{ error }]
    }

    dispatch([
      //TODO: Open
      // {
      //     type: TeamTypes.RECEIVED_MY_TEAM_MEMBERS,
      //     data: teamMembers,
      // },
      {
        type: UserTypes.LOGIN_SUCCESS,
      },
    ])
    const roles = new Set<string>()
    for (const role of data.roles.split(' ')) {
      roles.add(role)
    }
    for (const teamMember of teamMembers) {
      for (const role of teamMember.roles.split(' ')) {
        roles.add(role)
      }
    }
    if (roles.size > 0) {
      dispatch(loadRolesIfNeeded(roles))
    }

    return [{ data: true }]
  }
}

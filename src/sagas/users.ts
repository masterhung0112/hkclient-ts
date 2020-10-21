import { getMyPreferences } from 'actions/preferences'
import { getMe } from 'actions/users'
import { all, call, select, takeEvery } from 'redux-saga/effects'
import { getCurrentUser, getCurrentUserId } from 'selectors/users'
import { HkClient } from 'hkclient'
import { UserTypes } from 'action-types'
import { Action, ActionResultType } from 'types/actions'
import { loadRolesIfNeeded } from 'actions/roles'
import { bindClientSaga } from 'actions/helpers'
import { AnyAction } from 'redux'
import { withPromise } from 'hkredux'

export function* loadMe(): Generator<Action, ActionResultType, any> {
  //   const config = yield select(getConfig)

  //TODO: Open this
  // const deviceId = state.entities.general.deviceToken;
  // if (deviceId) {
  //     HkClient.attachDevice(deviceId);
  // }

  yield all([
    call(getMe),
    call(getMyPreferences),
    // dispatch(getMyTeams()),
    // dispatch(getMyTeamMembers()),
    // dispatch(getMyTeamUnreads()),
  ])

  // Sometimes the server version is set in one or the other
  //TODO: Open this
  // const serverVersion = HkClient.serverVersion || getState().entities.general.serverVersion;
  // dispatch(setServerVersion(serverVersion));
  // if (!isMinimumServerVersion(serverVersion, 4, 7) && config.EnableCustomEmoji === 'true') {
  // dispatch(getAllCustomEmojis());
  // }

  const currentUserId = yield select(getCurrentUserId)
  const user = yield select(getCurrentUser)
  if (currentUserId) {
    HkClient.userId = currentUserId
  }

  if (user) {
    HkClient.userRoles = user.roles
  }

  return [{ data: true }]
}

export function* fetchMe(): Generator<Action, ActionResultType, any> {
  const me = yield* bindClientSaga({
    clientFunc: HkClient.getMe,
    onSuccess: UserTypes.RECEIVED_ME,
  })()

  if (me && 'error' in me[0]) {
    return me
  }
  if (me && 'data' in me[0]) {
    yield call(loadRolesIfNeeded, me[0].data.roles.split(' '))
  }
  return me
}

export function* fetchUserByUsername({ username }: AnyAction): Generator<Action, ActionResultType, any> {
  return yield* bindClientSaga({
    clientFunc: HkClient.getUserByUsername,
    onSuccess: UserTypes.RECEIVED_PROFILE,
    params: [username],
  })()
}

export function* fetchUserByEmail({ email }: AnyAction): Generator<Action, ActionResultType, any> {
  return yield* bindClientSaga({
    clientFunc: HkClient.getUserByEmail,
    onSuccess: UserTypes.RECEIVED_PROFILE,
    params: [email],
  })()
}

export function* watchUsers(): Generator<Action, void, any> {
  yield takeEvery(UserTypes.LOAD_ME, withPromise(loadMe))
  yield takeEvery(UserTypes.GET_ME, withPromise(fetchMe))
  yield takeEvery(UserTypes.GET_USER_BY_USERNAME, withPromise(fetchUserByUsername))
  yield takeEvery(UserTypes.GET_USER_BY_EMAIL, withPromise(fetchUserByEmail))
}

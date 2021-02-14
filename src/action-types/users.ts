import keyMirror from 'utils/key_mirror'

export const UserTypes = keyMirror({
  // Saga
  LOAD_ME: null,
  GET_ME: null,
  GET_USER_BY_USERNAME: null,
  GET_USER_BY_EMAIL: null,

  // Reducers
  LOGOUT_SUCCESS: null,
  RECEIVED_ME: null,
  RECEIVED_PROFILE: null,
  RECEIVED_PROFILES: null,

  LOGIN_REQUEST: null,
  LOGIN_SUCCESS: null,
  LOGIN_FAILURE: null,
})

export default UserTypes

import { ClientConfig, ClientLicense } from 'types/config'
import { GenericAction } from 'types/actions'
import { combineReducers } from 'redux'
import { UserTypes, GeneralTypes } from 'action-types'

function config(state: Partial<ClientConfig> = {}, action: GenericAction) {
  switch (action.type) {
    case '__NEXT_REDUX_WRAPPER_HYDRATE__':
      console.log('@@ wrapper config hydrate', action.payload.entities.general.config.EnableSignInWithEmail)
      return { ...state, ...action.payload.entities.general.config }

    case GeneralTypes.CLIENT_CONFIG_RECEIVED:
      return Object.assign({}, state, action.data)
    // case UserTypes.LOGIN: // Used by the mobile app
    // case GeneralTypes.SET_CONFIG_AND_LICENSE:
    //     return Object.assign({}, state, action.data.config);
    // case GeneralTypes.CLIENT_CONFIG_RESET:
    case UserTypes.LOGOUT_SUCCESS:
      return {}
    default:
      return state
  }
  return state
}

function license(state: ClientLicense = {}, action: GenericAction) {
  switch (action.type) {
    // case GeneralTypes.CLIENT_LICENSE_RECEIVED:
    //     return action.data;
    // case GeneralTypes.SET_CONFIG_AND_LICENSE:
    //     return Object.assign({}, state, action.data.license);
    // case GeneralTypes.CLIENT_LICENSE_RESET:
    case UserTypes.LOGOUT_SUCCESS:
      return {}
    default:
      return state
  }
}

function deviceToken(state = '', action: GenericAction) {
  switch (action.type) {
    // case GeneralTypes.RECEIVED_APP_DEVICE_TOKEN:
    //     return action.data;
    default:
      return state
  }
}

function serverVersion(state = '', action: GenericAction) {
  switch (action.type) {
    // case GeneralTypes.RECEIVED_SERVER_VERSION:
    //     return action.data;
    case UserTypes.LOGOUT_SUCCESS:
      return ''
    default:
      return state
  }
}

export default combineReducers({
  config,
  license,
  deviceToken,
  serverVersion,
})

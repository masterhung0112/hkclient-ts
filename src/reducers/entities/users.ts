import { GenericAction } from 'types/actions'
import { combineReducers } from 'redux'
import { IDMappedObjects } from 'types/utilities'
import { UserProfile } from 'types/users'
import { UserTypes } from 'action-types'

function currentUserId(state = '', action: GenericAction) {
    switch (action.type) {
      case UserTypes.RECEIVED_ME: {
        const data = action.data || action.payload

        return data.id
      }

  //     case UserTypes.LOGIN: {
  //       // Used by the mobile app
  //       const { user } = action.data

  //       return user ? user.id : state
  //     }
  //     case UserTypes.LOGOUT_SUCCESS:
  //       return ''
    }

  return state
}


function profiles(state: IDMappedObjects<UserProfile> = {}, action: GenericAction) {
  switch (action.type) {
  case UserTypes.RECEIVED_ME: {
  // case UserTypes.RECEIVED_PROFILE: {
    const data = action.data || action.payload;
    const user = {...data};
    const oldUser = state[data.id];
    if (oldUser) {
        user.terms_of_service_id = oldUser.terms_of_service_id;
        user.terms_of_service_create_at = oldUser.terms_of_service_create_at;
    }

    return {
        ...state,
        [data.id]: user,
    }
  }
  }
  return state
}

export default combineReducers({
  // the current selected user
  currentUserId,

  // object where every key is a user id and has an object with the users details
  profiles,
})

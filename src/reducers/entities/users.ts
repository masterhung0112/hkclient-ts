import { GenericAction } from 'types/actions'
import { combineReducers } from 'redux'

function currentUserId(state = '', action: GenericAction) {
  //   switch (action.type) {
  //     case UserTypes.RECEIVED_ME: {
  //       const data = action.data || action.payload

  //       return data.id
  //     }

  //     case UserTypes.LOGIN: {
  //       // Used by the mobile app
  //       const { user } = action.data

  //       return user ? user.id : state
  //     }
  //     case UserTypes.LOGOUT_SUCCESS:
  //       return ''
  //   }

  return state
}

export default combineReducers({
  // the current selected user
  currentUserId,
})

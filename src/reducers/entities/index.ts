import users from './users'
import general from './general'
import roles from './roles'
import teams from './teams'
import channels from './channels'
export * from './counter'

import { combineReducers } from 'redux'

export default combineReducers({
  general,
  users,
  roles,
  teams,
  channels,
})

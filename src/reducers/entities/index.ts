import users from './users'
import general from './general'
import roles from './roles'
import teams from './teams'

import { combineReducers } from 'redux'

export default combineReducers({
  general,
  users,
  roles,
  teams,
})

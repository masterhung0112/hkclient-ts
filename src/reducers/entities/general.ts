import { ClientConfig } from 'types/config'
import { GenericAction } from 'types/actions'
import { combineReducers } from 'redux'

function config(state: Partial<ClientConfig> = {}, action: GenericAction) {
    return state
}

export default combineReducers({
    config,
})
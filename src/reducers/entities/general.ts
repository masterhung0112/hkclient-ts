import { ClientConfig } from 'types/config'
import { GenericAction } from 'types/actions'
import { combineReducers } from 'redux'
import { UserTypes, GeneralTypes } from 'action-types';

function config(state: Partial<ClientConfig> = {}, action: GenericAction) {
    return state
}

function serverVersion(state = '', action: GenericAction) {
    switch (action.type) {
    // case GeneralTypes.RECEIVED_SERVER_VERSION:
    //     return action.data;
    case UserTypes.LOGOUT_SUCCESS:
        return '';
    default:
        return state;
    }
}

export default combineReducers({
    config,
    serverVersion,
})
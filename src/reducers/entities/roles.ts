import { combineReducers } from 'redux';
import { Role } from 'types/roles';
import { GenericAction } from 'types/actions';

function roles(state: Record<string, Role> = {}, action: GenericAction) {
    return state
}

function pending(state: Set<string> = new Set(), action: GenericAction) {
    return state
}

export default combineReducers({
    // object where the key is the category-name and has the corresponding value
    roles,
    pending,
})
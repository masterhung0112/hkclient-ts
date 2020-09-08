import { GlobalState } from 'types/store';

export function getRoles(state: GlobalState) {
    return state.entities.roles.roles;
}
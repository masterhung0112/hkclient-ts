import { GlobalState } from 'types/store';

export function getTeamMemberships(state: GlobalState) {
    return state.entities.teams.myMembers;
}
import { GlobalState } from 'types/store';
import { createSelector } from 'reselect'
import { Team } from 'types/teams';
import { IDMappedObjects } from 'types/utilities';

export function getTeams(state: GlobalState): IDMappedObjects<Team> {
    return state.entities.teams.teams;
}

export function getTeamMemberships(state: GlobalState) {
    return state.entities.teams.myMembers;
}

export const getMyTeams: (state: GlobalState) => Team[] = createSelector(
    getTeams,
    getTeamMemberships,
    (teams, members) => {
        return Object.values(teams).filter((t) => members[t.id] && t.delete_at === 0);
    },
)

export function getTeam(state: GlobalState, id: string): Team {
    const teams = getTeams(state);
    return teams[id];
}
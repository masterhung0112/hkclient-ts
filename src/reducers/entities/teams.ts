import { IDMappedObjects, RelationOneToOne } from 'types/utilities';
import { GenericAction } from 'types/actions';
import { UserTypes } from 'action-types';
import { TeamMembership, Team } from 'types/teams';
import { combineReducers } from 'redux';

function currentTeamId(state = '', action: GenericAction) {
    switch (action.type) {
    // case TeamTypes.SELECT_TEAM:
    //     return action.data;

    case UserTypes.LOGOUT_SUCCESS:
        return '';
    
    default:
        return state;
    }
}

function teams(state: IDMappedObjects<Team> = {}, action: GenericAction) {
    switch (action.type) {
    // case TeamTypes.RECEIVED_TEAMS_LIST:
    // case SchemeTypes.RECEIVED_SCHEME_TEAMS:
    //     return Object.assign({}, state, teamListToMap(action.data));
    // case UserTypes.LOGIN: // Used by the mobile app
    //     return Object.assign({}, state, teamListToMap(action.data.teams));
    // case TeamTypes.RECEIVED_TEAMS:
    //     return Object.assign({}, state, action.data);

    // case TeamTypes.CREATED_TEAM:
    // case TeamTypes.UPDATED_TEAM:
    // case TeamTypes.PATCHED_TEAM:
    // case TeamTypes.REGENERATED_TEAM_INVITE_ID:
    // case TeamTypes.RECEIVED_TEAM:
    //     return {
    //         ...state,
    //         [action.data.id]: action.data,
    //     };

    // case TeamTypes.RECEIVED_TEAM_DELETED: {
    //     const nextState = {...state};
    //     const teamId = action.data.id;
    //     if (nextState.hasOwnProperty(teamId)) {
    //         Reflect.deleteProperty(nextState, teamId);
    //         return nextState;
    //     }

    //     return state;
    // }

    // case TeamTypes.UPDATED_TEAM_SCHEME: {
    //     const {teamId, schemeId} = action.data;
    //     const team = state[teamId];

    //     if (!team) {
    //         return state;
    //     }

    //     return {...state, [teamId]: {...team, scheme_id: schemeId}};
    // }

    case UserTypes.LOGOUT_SUCCESS:
        return {};

    default:
        return state;
    }
}

function myMembers(state: RelationOneToOne<Team, TeamMembership> = {}, action: GenericAction) {
    switch (action.type) {
        case UserTypes.LOGOUT_SUCCESS:
            return {}

        default:
            return state
    }
}

export default combineReducers({
    // the current selected team
    currentTeamId,

    // object where every key is the team id and has and object with the team detail
    teams,

    // object where every key is the team id and has and object with the team members detail
    myMembers,
})
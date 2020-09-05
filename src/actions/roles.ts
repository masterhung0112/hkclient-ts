import { ActionFunc, DispatchFunc, GetStateFunc } from 'types/actions';

export function loadRolesIfNeeded(roles: Iterable<string>): ActionFunc {
    return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
        const state = getState();
        let pendingRoles = new Set<string>();

        try {
            pendingRoles = new Set<string>(state.entities.roles.pending);
        } catch (e) {// eslint-disable-line
        }

        for (const role of roles) {
            pendingRoles.add(role);
        }
        if (!state.entities.general.serverVersion) {
            dispatch(setPendingRoles(Array.from(pendingRoles)));
            setTimeout(() => dispatch(loadRolesIfNeeded([])), 500);
            return {data: []};
        }
        if (!hasNewPermissions(state)) {
            if (state.entities.roles.pending) {
                await dispatch(setPendingRoles([]));
            }
            return {data: []};
        }
        const loadedRoles = getRoles(state);
        const newRoles = new Set<string>();

        for (const role of pendingRoles) {
            if (!loadedRoles[role] && role.trim() !== '') {
                newRoles.add(role);
            }
        }

        if (state.entities.roles.pending) {
            await dispatch(setPendingRoles([]));
        }
        if (newRoles.size > 0) {
            return getRolesByNames(Array.from(newRoles))(dispatch, getState);
        }
        return {data: state.entities.roles.roles};
    };
}
import { GlobalState } from 'types/store';
import { createSelector } from 'reselect';
import { getRoles, PermissionsOptions, getMySystemPermissions } from './roles_helpers';
import { getTeamMemberships } from './teams';
import { Dictionary } from 'types/utilities';

export const getMyTeamRoles: (state: GlobalState) => Dictionary<Set<string>> = createSelector(
    getTeamMemberships,
    (teamsMemberships) => {
        const roles: Dictionary<Set<string>> = {};
        if (teamsMemberships) {
            for (const key in teamsMemberships) {
                if (Object.prototype.hasOwnProperty.call(teamsMemberships, key) && teamsMemberships[key].roles) {
                    roles[key] = new Set<string>(teamsMemberships[key].roles.split(' '));
                }
            }
        }
        return roles;
    },
)

export const getMyTeamPermissions: (state: GlobalState, options: PermissionsOptions) => Set<string> = createSelector(
    getMyTeamRoles,
    getRoles,
    getMySystemPermissions,
    (state: GlobalState, options: PermissionsOptions) => options.team,
    (myTeamRoles, roles, systemPermissions, teamId) => {
        const permissions = new Set<string>();
        if (myTeamRoles[teamId!]) {
            for (const roleName of myTeamRoles[teamId!]) {
                if (roles[roleName]) {
                    for (const permission of roles[roleName].permissions) {
                        permissions.add(permission);
                    }
                }
            }
        }
        for (const permission of systemPermissions) {
            permissions.add(permission);
        }
        return permissions;
    },
)

export const haveITeamPermission: (state: GlobalState, options: PermissionsOptions) => boolean = createSelector(
    getMyTeamPermissions,
    (state, options) => options.permission,
    (permissions, permission) => {
        return permissions.has(permission);
    },
)
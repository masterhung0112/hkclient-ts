import { ActionFunc, DispatchFunc, GetStateFunc } from 'types/actions';
import { HkClient } from 'hkclient';
import { getConfig } from 'selectors/entities/general';
import { UserTypes } from 'action-types';
import { bindClientFunc } from './helpers';
import { getMyPreferences } from './preferences';
import { loadRolesIfNeeded } from './roles';

export function loadMe(): ActionFunc {
    return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
        const state = getState();
        const config = getConfig(state);

        //TODO: Open this
        // const deviceId = state.entities.general.deviceToken;
        // if (deviceId) {
        //     HkClient.attachDevice(deviceId);
        // }

        const promises = [
            dispatch(getMe()),
            dispatch(getMyPreferences()),
            // dispatch(getMyTeams()),
            // dispatch(getMyTeamMembers()),
            // dispatch(getMyTeamUnreads()),
        ];

        // Sometimes the server version is set in one or the other
        //TODO: Open this
        // const serverVersion = HkClient.serverVersion || getState().entities.general.serverVersion;
        // dispatch(setServerVersion(serverVersion));
        // if (!isMinimumServerVersion(serverVersion, 4, 7) && config.EnableCustomEmoji === 'true') {
            // dispatch(getAllCustomEmojis());
        // }

        await Promise.all(promises);

        const {currentUserId} = getState().entities.users;
        const user = getState().entities.users.profiles[currentUserId];
        if (currentUserId) {
            HkClient.userId = currentUserId
        }

        if (user) {
            HkClient.userRoles = user.roles
        }

        return {data: true};
    };
}

export function getMe(): ActionFunc {
    return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
        const getMeFunc = bindClientFunc({
            clientFunc: HkClient.getMe,
            onSuccess: UserTypes.RECEIVED_ME,
        });
        const me = await getMeFunc(dispatch, getState);

        if ('error' in me) {
            return me;
        }
        if ('data' in me) {
            dispatch(loadRolesIfNeeded(me.data.roles.split(' ')));
        }
        return me;
    };
}

export function getUserByUsername(username: string): ActionFunc {
    return bindClientFunc({
        clientFunc: HkClient.getUserByUsername,
        onSuccess: UserTypes.RECEIVED_PROFILE,
        params: [
            username,
        ],
    });
}

export function getUserByEmail(email: string): ActionFunc {
    return bindClientFunc({
        clientFunc: HkClient.getUserByEmail,
        onSuccess: UserTypes.RECEIVED_PROFILE,
        params: [
            email,
        ],
    });
}
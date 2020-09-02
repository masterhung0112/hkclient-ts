import { DispatchFunc, GetStateFunc } from 'types/actions';
import { HkClient } from 'hkclient'
import { UserTypes } from 'action-types';
import { HkClientError } from 'types/hkclient';
const HTTP_UNAUTHORIZED = 401


export function forceLogoutIfNecessary(err: HkClientError, dispatch: DispatchFunc, getState: GetStateFunc) {
    const {currentUserId} = getState().entities.users;

    if ('status_code' in err && err.status_code === HTTP_UNAUTHORIZED && err.url && err.url.indexOf('/login') === -1 && currentUserId) {
        HkClient.token = ''
        dispatch({type: UserTypes.LOGOUT_SUCCESS, data: {}});
    }
}
import { ActionFunc, DispatchFunc, GetStateFunc, batchActions } from 'types/actions';
import { HkClient } from 'hkclient';
import { forceLogoutIfNecessary } from './helpers';
import { GeneralTypes } from 'action-types';

export function setUrl(url: string): boolean {
    HkClient.url = url
    return true
}

export function getClientConfig(): ActionFunc {
    return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
        let data;
        try {
            data = await HkClient.getClientConfigOld();
        } catch (error) {
            forceLogoutIfNecessary(error, dispatch, getState);
            return {error};
        }

        // HkClient.setEnableLogging(data.EnableDeveloper === 'true');
        // HkClient.setDiagnosticId(data.DiagnosticId);

        dispatch(batchActions([
            {type: GeneralTypes.CLIENT_CONFIG_RECEIVED, data},
        ]));

        return {data};
    };
}
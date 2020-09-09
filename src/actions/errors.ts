import { ServerError } from 'types/errors';
import { ActionFunc, DispatchFunc } from 'types/actions';
import { serializeError, ErrorObject } from 'serialize-error'
import { HkClient } from 'hkclient';
import { ErrorTypes } from 'action-types';

export function logError(error: ServerError, displayable = false): ActionFunc {
    return async (dispatch: DispatchFunc) => {
        if (error.server_error_id === 'api.context.session_expired.app_error') {
            return {data: true};
        }

        const serializedError = serializeError(error);

        let sendToServer = true;
        if (error.stack && error.stack.includes('TypeError: Failed to fetch')) {
            sendToServer = false;
        }
        if (error.server_error_id) {
            sendToServer = false;
        }

        if (sendToServer) {
            try {
                const stringifiedSerializedError = JSON.stringify(serializedError).toString();
                await HkClient.logClientError(stringifiedSerializedError);
            } catch (err) {
                // avoid crashing the app if an error sending
                // the error occurs.
            }
        }

        //TODO: Open this
        // EventEmitter.emit(ErrorTypes.LOG_ERROR, error);
        dispatch(getLogErrorAction(serializedError, displayable));

        return {data: true};
    };
}

export function getLogErrorAction(error: ErrorObject, displayable = false) {
    return {
        type: ErrorTypes.LOG_ERROR,
        displayable,
        error,
        data: null,
    };
}
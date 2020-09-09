import { ActionFunc } from 'types/actions';
import { HkClient } from 'hkclient';
import { bindClientFunc } from './helpers';
import { PreferenceTypes } from 'action-types';

export function getMyPreferences(): ActionFunc {
    return bindClientFunc({
        clientFunc: HkClient.getMyPreferences,
        onSuccess: PreferenceTypes.RECEIVED_ALL_PREFERENCES,
    });
}
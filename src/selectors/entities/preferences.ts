import { GlobalState } from 'types/store';
import { createSelector } from 'reselect';
import { getConfig, getLicense } from './general';
import { getMyPreferences } from 'actions/preferences';
import { General, Preferences } from '../../constants';
import { getPreferenceKey } from 'utils/preferences_utils';

export const getTeammateNameDisplaySetting: (state: GlobalState) => string | undefined = createSelector(
    getConfig,
    getMyPreferences,
    getLicense,
    (config, preferences, license) => {
        const useAdminTeammateNameDisplaySetting = (license && license.LockTeammateNameDisplay === 'true') && config.LockTeammateNameDisplay === 'true';
        const key = getPreferenceKey(Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.NAME_NAME_FORMAT);
        if (preferences[key] && !useAdminTeammateNameDisplaySetting) {
            return preferences[key].value;
        } else if (config.TeammateNameDisplay) {
            return config.TeammateNameDisplay;
        }
        return General.TEAMMATE_NAME_DISPLAY.SHOW_USERNAME;
    },
)
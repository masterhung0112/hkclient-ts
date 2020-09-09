import { GlobalState } from 'types/store';
import { ClientConfig } from 'types/config';
import { isMinimumServerVersion } from 'utils/helpers';

export function getConfig(state: GlobalState): Partial<ClientConfig> {
    return state.entities.general.config;
}

export function getLicense(state: GlobalState): any {
    return state.entities.general.license;
}

export function hasNewPermissions(state: GlobalState): boolean {
    const version = state.entities.general.serverVersion;

    // FIXME This must be changed to 4, 9, 0 before we generate the 4.9.0 release
    return isMinimumServerVersion(version, 4, 9, 0) ||
           (version.indexOf('dev') !== -1 && isMinimumServerVersion(version, 4, 8, 0)) ||
           (version.match(/^4.8.\d.\d\d\d\d.*$/) !== null && isMinimumServerVersion(version, 4, 8, 0))
}
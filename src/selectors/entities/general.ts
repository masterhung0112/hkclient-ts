import { GlobalState } from 'types/store';
import { ClientConfig } from 'types/config';

export function getConfig(state: GlobalState): Partial<ClientConfig> {
    return state.entities.general.config;
}
import { ClientConfig } from './config';

export type GeneralState = {
    config: Partial<ClientConfig>
    serverVersion: string
}
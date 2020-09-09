import { ClientConfig, ClientLicense } from './config';

export type GeneralState = {
    config: Partial<ClientConfig>
    serverVersion: string
    license: ClientLicense
}
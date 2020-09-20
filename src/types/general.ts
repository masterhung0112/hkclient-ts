import { ClientConfig, ClientLicense } from './config'

export type GeneralState = {
  config: Partial<ClientConfig>
  serverVersion: string
  deviceToken: string
  license: ClientLicense
}

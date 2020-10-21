import { General } from 'hkconstants'
import { ClientConfig, ClientLicense } from './config'

export type GeneralState = {
  config: Partial<ClientConfig>
  serverVersion: string
  deviceToken: string
  license: ClientLicense
}

export interface GeneralAwareState {
  [General.GENERAL_MODULE_NAME]: GeneralState
}

import { General } from 'hkconstants/general'
import { ClientConfig, ClientLicense, WarnMetricStatus } from './config'

import { Dictionary } from './utilities'

export type GeneralState = {
  appState: boolean
  credentials: any
  config: Partial<ClientConfig>
  dataRetentionPolicy: any
  deviceToken: string
  license: ClientLicense
  serverVersion: string
  timezones: string[]
  warnMetricsStatus: Dictionary<WarnMetricStatus>
}

export interface GeneralAwareState {
  [General.GENERAL_MODULE_NAME]: GeneralState
}

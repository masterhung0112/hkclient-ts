import { General } from 'hkconstants/general'
import { ClientConfig, ClientLicense, WarnMetricStatus } from './config'

import { Dictionary } from './utilities'

export type GeneralState = {
  appState: boolean
  credentials: any
  config: Partial<ClientConfig>
  dataRetentionPolicy: any
  deviceToken: string
  firstAdminVisitMarketplaceStatus: boolean
  license: ClientLicense
  serverVersion: string
  timezones: string[]
  warnMetricsStatus: Dictionary<WarnMetricStatus>
}

export type SystemSetting = {
  name: string
  value: string
}

export interface GeneralAwareState {
  [General.GENERAL_MODULE_NAME]: GeneralState
}

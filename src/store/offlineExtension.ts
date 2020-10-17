import { offline } from '@redux-offline/redux-offline'
import { Config } from '@redux-offline/redux-offline/lib/types'
import { IExtension } from 'redux-dynamic-modules-core'

export function getReduxOfflineExtension(offlineConfig: Partial<Config>): IExtension {
  const offlineMiddleware = offline(offlineConfig)

  return {
    middleware: [offlineMiddleware],
  }
}

import { AsyncNodeStorage } from 'redux-persist-node-storage'
import { createTransform, persistStore } from 'redux-persist'

import configureStore from '../store'

export default async function testConfigureStore(preloadedState = null) {
  const storageTransform = createTransform(
    () => ({}),
    () => ({})
  )

  //TODO: Upgrade redux-persist to v6 (https://gist.github.com/jarvisluong/f14872b9c7ed00bc2afc89c4622e3b55)
  const offlineConfig = {
    detectNetwork: (callback) => callback(true),
    persist: (store, options) => {
      return persistStore(store, { storage: new AsyncNodeStorage('./.tmp'), ...options })
    },
    persistOptions: {
      debounce: 1000,
      transforms: [storageTransform],
      whitelist: [],
    },
    retry: (action, retries) => 200 * (retries + 1),
    discard: (error, action, retries) => {
      if (action.meta && action.meta.offline.hasOwnProperty('maxRetry')) {
        return retries >= action.meta.offline.maxRetry
      }

      return retries >= 1
    },
  }

  const store = configureStore(preloadedState, {}, offlineConfig, () => ({}), { enableBuffer: false })

    const wait = () => new Promise((resolve) => setTimeout(resolve, 300)) //eslint-disable-line
  await wait()

  return store
}

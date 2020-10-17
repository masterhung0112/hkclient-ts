import { default as createSagaMiddleware, SagaMiddleware } from 'redux-saga'
import { IExtension, getRefCountedManager, IModuleManager } from 'redux-dynamic-modules-core'
import { ISagaRegistration, ISagaModule, ISagaItemManager } from './contracts'
import { getSagaManager } from './sagaManager'
import { sagaEquals } from './sagaComparer'

export type SagaExtensionContext = {
  moduleManager?: IModuleManager
  sagaManager?: ISagaItemManager<ISagaRegistration<any>>
} & Record<string, any>

/**
 * Get an extension that integrates saga with the store
 * @param sagaContext The context to provide to the saga
 */
export function getSagaExtension<C extends SagaExtensionContext>(
  sagaContext?: C,
  onError?: (error: Error) => void
): IExtension {
  let sagaMonitor = undefined

  //@ts-ignore
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    sagaMonitor = (window as any)['__SAGA_MONITOR_EXTENSION__'] || undefined
  }

  // Setup the saga middleware
  let sagaMiddleware: SagaMiddleware<C> = createSagaMiddleware<any>({
    context: sagaContext,
    sagaMonitor,
    onError,
  })

  let _sagaManager: ISagaItemManager<ISagaRegistration<any>> = getRefCountedManager(
    getSagaManager(sagaMiddleware),
    sagaEquals
  )

  return {
    middleware: [sagaMiddleware],

    onModuleManagerCreated: (moduleManager: IModuleManager) => {
      if (sagaContext) {
        sagaContext['moduleManager'] = moduleManager
        sagaContext['sagaManager'] = _sagaManager
      }
    },

    onModuleAdded: (module: ISagaModule<any>): void => {
      if (module.sagas) {
        _sagaManager.add(module.sagas)
      }
    },

    onModuleRemoved: (module: ISagaModule<any>): void => {
      if (module.sagas) {
        _sagaManager.remove(module.sagas)
      }
    },

    dispose: () => {
      _sagaManager.dispose()
    },
  }
}

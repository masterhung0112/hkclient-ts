// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {default as createSagaMiddleware, SagaMiddleware} from 'redux-saga';
import {IExtension, getRefCountedManager, IModuleManager} from 'redux-dynamic-modules-core';
import {ISagaRegistration, ISagaModule, ISagaItemManager} from './contracts';
import {getSagaManager} from './sagaManager';
import {sagaEquals} from './sagaComparer';

export type SagaExtensionContext = {
  moduleManager?: IModuleManager;
  sagaManager?: ISagaItemManager<ISagaRegistration<any>>;
} & Record<string, any>

/**
 * Get an extension that integrates saga with the store
 * @param sagaContext The context to provide to the saga
 */
export function getSagaExtension<C extends SagaExtensionContext>(
    sagaContext?: C,
    onError?: (error: Error) => void,
): IExtension {
    const sagaMonitor = undefined;

    // eslint-disable-next-line no-process-env
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    // sagaMonitor = (window as any)['__SAGA_MONITOR_EXTENSION__'] || undefined
    }

    // Setup the saga middleware
    const sagaMiddleware: SagaMiddleware<C> = createSagaMiddleware<any>({
        context: sagaContext,
        sagaMonitor,
        onError,
    });

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const sagaManager: ISagaItemManager<ISagaRegistration<any>> = getRefCountedManager(
        getSagaManager(sagaMiddleware),
        sagaEquals,
    );

    return {
        middleware: [sagaMiddleware],

        onModuleManagerCreated: (moduleManager: IModuleManager) => {
            if (sagaContext) {
                sagaContext.moduleManager = moduleManager;
                sagaContext.sagaManager = sagaManager;
            }
        },

        onModuleAdded: (module: ISagaModule<any>): void => {
            if (module.sagas) {
                sagaManager.add(module.sagas);
            }
        },

        onModuleRemoved: (module: ISagaModule<any>): void => {
            if (module.sagas) {
                sagaManager.remove(module.sagas);
            }
        },

        dispose: () => {
            sagaManager.dispose();
        },
    };
}

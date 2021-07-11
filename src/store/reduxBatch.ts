// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {AnyAction, PreloadedState, Reducer, Store, StoreEnhancerStoreCreator} from 'redux';

export default function reduxBatch<Ext = Record<string, unknown>, StateExt = Record<string, unknown>>(
    next: StoreEnhancerStoreCreator,
): StoreEnhancerStoreCreator<Ext, StateExt> {
    let nextListeners: any[] = [];
    let currentListeners: any[];

    function ensureCanMutateNextListeners() {
        if (nextListeners === currentListeners) {
            nextListeners = nextListeners.slice();
        }
    }

    function subscribe(listener: any) {
        if (typeof listener !== 'function') {
            throw new Error('Invalid listener, expected a function');
        }

        let isSubscribed = true;

        ensureCanMutateNextListeners();
        nextListeners.push(listener);

        return function unsubscribe() {
            if (!isSubscribed) {
                return;
            }

            ensureCanMutateNextListeners();
            nextListeners.splice(nextListeners.indexOf(listener), 1);

            isSubscribed = false;
        };
    }

    function notifyListeners() {
        const listeners = nextListeners;

        for (let t = 0; t < listeners.length; ++t) {
            currentListeners = listeners;
            listeners[t]();
        }
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line func-names
    return function <S = Record<string, any>, A extends AnyAction = AnyAction>(
        reducer: Reducer<S, A>,
        preloadedState?: PreloadedState<S>,
    ): Store<S & StateExt, A> & Ext {
        const store = next(reducer, preloadedState);

        let receivedNotification = false;
        let inDispatch = false;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function dispatchRecurse(action: A[] | A): any {
            // Support { meta: { batch: true } } in action
            let targetAction: A[] = [];
            let isArrayActions = false;
            if (Array.isArray(action)) {
                isArrayActions = true;
                targetAction = action;
            // eslint-disable-next-line dot-notation
            } else if (action && 'meta' in action && action['meta'].batch) {
                isArrayActions = true;
                // eslint-disable-next-line dot-notation
                targetAction = action['payload'];
            }
            try {
                const result = isArrayActions ? targetAction.map((subAction) => {
                    return dispatchRecurse(subAction as A);
                }) : store.dispatch(action as A);
                return result;
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
            }

            return null;
        }

        function dispatch(action: A[] | A) {
            const reentrant = inDispatch;

            if (!reentrant) {
                receivedNotification = false;
                inDispatch = true;
            }

            const result = dispatchRecurse(action);
            const requiresNotification = receivedNotification && !reentrant;

            if (!reentrant) {
                receivedNotification = false;
                inDispatch = false;
            }

            if (requiresNotification) {
                notifyListeners();
            }

            return result;
        }

        store.subscribe(() => {
            if (inDispatch) {
                receivedNotification = true;
            } else {
                notifyListeners();
            }
        });

        return Object.assign({}, store, {
            dispatch,
            subscribe,
        }) as Store<S & StateExt, A> & Ext;
    };
}

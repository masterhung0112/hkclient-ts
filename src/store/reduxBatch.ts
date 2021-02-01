import { Action, AnyAction, PreloadedState, Reducer, Store, StoreEnhancerStoreCreator } from 'redux'

export default function reduxBatch<Ext = Record<string, unknown>, StateExt = Record<string, unknown>>(
  next: StoreEnhancerStoreCreator
): StoreEnhancerStoreCreator<Ext, StateExt> {
  let nextListeners = []
  let currentListeners = undefined

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = nextListeners.slice()
    }
  }

  function subscribe(listener) {
    if (typeof listener !== `function`) throw new Error(`Invalid listener, expected a function`)

    let isSubscribed = true

    ensureCanMutateNextListeners()
    nextListeners.push(listener)

    return function unsubscribe() {
      if (!isSubscribed) return

      ensureCanMutateNextListeners()
      nextListeners.splice(nextListeners.indexOf(listener), 1)

      isSubscribed = false
    }
  }

  function notifyListeners() {
    const listeners = nextListeners

    for (let t = 0; t < listeners.length; ++t) {
      currentListeners = listeners
      listeners[t]()
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  return function <S = {}, A extends Action = AnyAction>(
    reducer: Reducer<S, A>,
    preloadedState?: PreloadedState<S>
  ): Store<S & StateExt, A> & Ext {
    const store = next(reducer, preloadedState)

    let receivedNotification = false
    let inDispatch = false

    function dispatchRecurse(action: A[] | A) {
      // console.log('is Array', Array.isArray(action), action)
      return Array.isArray(action)
        ? action.map((subAction) => {
            // console.log('subAction', subAction)
            return dispatchRecurse(subAction)
          })
        : store.dispatch(action)
    }

    function dispatch(action: A[] | A) {
      const reentrant = inDispatch

      if (!reentrant) {
        receivedNotification = false
        inDispatch = true
      }

      const result = dispatchRecurse(action)
      const requiresNotification = receivedNotification && !reentrant

      if (!reentrant) {
        receivedNotification = false
        inDispatch = false
      }

      if (requiresNotification) notifyListeners()

      return result
    }

    store.subscribe(() => {
      if (inDispatch) {
        receivedNotification = true
      } else {
        notifyListeners()
      }
    })

    return Object.assign({}, store, {
      dispatch,
      subscribe,
    }) as Store<S & StateExt, A> & Ext
  }
}

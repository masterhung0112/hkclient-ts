import { DispatchFunc, GetStateFunc, ActionFunc, GenericAction, Action, ActionResultType } from 'types/actions'
import { HkClient } from 'hkclient'
import { UserTypes } from 'action-types'
import { HkClientError } from 'types/hkclient'
import { logError } from './errors'
import { getCurrentUserId } from 'selectors/users'
import { all, call, put, select } from 'redux-saga/effects'
const HTTP_UNAUTHORIZED = 401

type ActionType = string

export function forceLogoutIfNecessary(err: HkClientError, dispatch: DispatchFunc, getState: GetStateFunc) {
  const currentUserId = getCurrentUserId(getState())

  if (
    'status_code' in err &&
    err.status_code === HTTP_UNAUTHORIZED &&
    err.url &&
    err.url.indexOf('/login') === -1 &&
    currentUserId
  ) {
    HkClient.token = ''
    dispatch({ type: UserTypes.LOGOUT_SUCCESS, data: {} })
  }
}

export function requestData(type: ActionType): GenericAction {
  return {
    type,
    data: null,
  }
}

export function* forceLogoutIfNecessarySaga(err: HkClientError): Generator {
  const currentUserId = yield select(getCurrentUserId)

  if (
    'status_code' in err &&
    err.status_code === HTTP_UNAUTHORIZED &&
    err.url &&
    err.url.indexOf('/login') === -1 &&
    currentUserId
  ) {
    HkClient.token = ''
    yield put({ type: UserTypes.LOGOUT_SUCCESS, data: {} })
  }
}

/**
 * Returns an ActionFunc which calls a specfied (client) function and
 * dispatches the specifed actions on request, success or failure.
 *
 * @export
 * @param {Object} obj                                       an object for destructirung required properties
 * @param {() => Promise<mixed>} obj.clientFunc              clientFunc to execute
 * @param {ActionType} obj.onRequest                         ActionType to dispatch on request
 * @param {(ActionType | Array<ActionType>)} obj.onSuccess   ActionType to dispatch on success
 * @param {ActionType} obj.onFailure                         ActionType to dispatch on failure
 * @param {...Array<any>} obj.params
 * @returns {ActionFunc} ActionFunc
 */
export function bindClientFunc({
  clientFunc,
  onRequest,
  onSuccess,
  onFailure,
  params = [],
}: {
  clientFunc: (...args: any[]) => Promise<any>
  onRequest?: ActionType
  onSuccess?: ActionType | Array<ActionType>
  onFailure?: ActionType
  params?: Array<any>
}): ActionFunc {
  return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
    if (onRequest) {
      dispatch(requestData(onRequest))
    }

    let data: any = null
    try {
      data = await clientFunc(...params)
    } catch (error) {
      forceLogoutIfNecessary(error, dispatch, getState)
      const actions: Action[] = [logError(error)]
      if (onFailure) {
        actions.push(requestFailure(onFailure, error))
      }
      dispatch(actions)
      return [{ error }]
    }

    if (Array.isArray(onSuccess)) {
      onSuccess.forEach((s) => {
        dispatcher(s, data, dispatch)
      })
    } else if (onSuccess) {
      dispatcher(onSuccess, data, dispatch)
    }

    return [{ data }]
  }
}

function dispatcher(type: ActionType, data: any, dispatch: DispatchFunc) {
  if (type.indexOf('SUCCESS') === -1) {
    // we don't want to pass the data for the request types
    dispatch(requestSuccess(type, data))
  } else {
    dispatch(requestData(type))
  }
}

export function requestSuccess(type: ActionType, data: any) {
  return {
    type,
    data,
  }
}

export function requestFailure(type: ActionType, error: HkClientError): any {
  return {
    type,
    error,
  }
}

export function bindClientSaga({
  clientFunc,
  onRequest,
  onSuccess,
  onFailure,
  params = [],
}: {
  clientFunc: (...args: any[]) => Promise<any>
  onRequest?: ActionType
  onSuccess?: ActionType | Array<ActionType>
  onFailure?: ActionType
  params?: Array<any>
}): any {
  return function* (): Generator<Action, ActionResultType, any> {
    if (onRequest) {
      yield call(requestData, onRequest)
    }

    let data: any = null
    try {
      data = yield call(clientFunc, ...params)
    } catch (error) {
      yield call(forceLogoutIfNecessarySaga, error)
      yield call(logError, error)
      if (onFailure) {
        yield put(requestFailure(onFailure, error))
      }
      return [{ error }]
    }

    if (Array.isArray(onSuccess)) {
      yield all(onSuccess.map((successType) => put(requestSuccess(successType, data))))
    } else if (onSuccess) {
      yield put(requestSuccess(onSuccess, data))
    }

    return [{ data }]
  }
}

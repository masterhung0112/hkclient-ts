import { DispatchFunc, GetStateFunc, ActionFunc, GenericAction, Action } from 'types/actions'
import { HkClient } from 'hkclient'
import { UserTypes } from 'action-types'
import { HkClientError } from 'types/hkclient'
import { logError } from './errors'
import { getCurrentUserId } from 'selectors/users'
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

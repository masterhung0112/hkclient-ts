import { ActionFunc, DispatchFunc, GetStateFunc } from 'types/actions'
import { hasNewPermissions } from 'selectors/entities/general'
import { getRoles } from 'selectors/entities/roles_helpers'
import { bindClientFunc } from './helpers'
import { HkClient } from 'hkclient'
import { RoleTypes } from 'action-types'

export function setPendingRoles(roles: Array<string>): ActionFunc {
  return async (dispatch: DispatchFunc) => {
    dispatch({ type: RoleTypes.SET_PENDING_ROLES, data: roles })
    return [{ data: roles }]
  }
}

export function getRolesByNames(rolesNames: Array<string>): ActionFunc {
  return bindClientFunc({
    clientFunc: HkClient.getRolesByNames,
    onRequest: RoleTypes.ROLES_BY_NAMES_REQUEST,
    onSuccess: [RoleTypes.RECEIVED_ROLES, RoleTypes.ROLES_BY_NAMES_SUCCESS],
    onFailure: RoleTypes.ROLES_BY_NAMES_FAILURE,
    params: [rolesNames],
  })
}

export function loadRolesIfNeeded(roles: Iterable<string>): ActionFunc {
  return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
    const state = getState()
    let pendingRoles = new Set<string>()

    try {
      pendingRoles = new Set<string>(state.entities.roles.pending)
        } catch (e) {// eslint-disable-line
    }

    for (const role of roles) {
      pendingRoles.add(role)
    }
    if (!state.entities.general.serverVersion) {
      dispatch(setPendingRoles(Array.from(pendingRoles)))
      setTimeout(() => dispatch(loadRolesIfNeeded([])), 500)
      return [{ data: [] }]
    }
    if (!hasNewPermissions(state)) {
      if (state.entities.roles.pending) {
        await dispatch(setPendingRoles([]))
      }
      return [{ data: [] }]
    }
    const loadedRoles = getRoles(state)
    const newRoles = new Set<string>()

    for (const role of pendingRoles) {
      if (!loadedRoles[role] && role.trim() !== '') {
        newRoles.add(role)
      }
    }

    if (state.entities.roles.pending) {
      await dispatch(setPendingRoles([]))
    }
    if (newRoles.size > 0) {
      return getRolesByNames(Array.from(newRoles))(dispatch, getState)
    }
    return [{ data: state.entities.roles.roles }]
  }
}

import { UsersAwareState } from 'types/users'
import { General } from '../../constants'
import { getCurrentUser } from '../users'

export function getCurrentUserLocale(state: UsersAwareState, defaultLocale = General.DEFAULT_LOCALE) {
  const currentUser = getCurrentUser(state)

  if (!currentUser) {
    return defaultLocale
  }

  return currentUser.locale || defaultLocale
}

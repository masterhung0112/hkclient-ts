import { GlobalState } from 'types/store'
import { General } from '../../constants'
import { getCurrentUser } from './users'

export function getCurrentUserLocale(state: GlobalState, defaultLocale = General.DEFAULT_LOCALE) {
  const currentUser = getCurrentUser(state)

  if (!currentUser) {
    return defaultLocale
  }

  return currentUser.locale || defaultLocale
}

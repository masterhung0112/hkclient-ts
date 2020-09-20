import { UserProfile } from 'types/users'
import { localizeMessage } from './i18n_utils'
import { Preferences } from '../constants'

export function getFullName(user: UserProfile): string {
  if (user.first_name && user.last_name) {
    return user.first_name + ' ' + user.last_name
  } else if (user.first_name) {
    return user.first_name
  } else if (user.last_name) {
    return user.last_name
  }

  return ''
}

export function displayUsername(user: UserProfile, teammateNameDisplay: string, useFallbackUsername = true): string {
  let name = useFallbackUsername ? localizeMessage('channel_loader.someone', 'Someone') : ''
  if (user) {
    if (teammateNameDisplay === Preferences.DISPLAY_PREFER_NICKNAME) {
      name = user.nickname || getFullName(user)
    } else if (teammateNameDisplay === Preferences.DISPLAY_PREFER_FULL_NAME) {
      name = getFullName(user)
    } else {
      name = user.username
    }

    if (!name || name.trim().length === 0) {
      name = user.username
    }
  }

  return name
}

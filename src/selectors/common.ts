import { GlobalState } from 'types/store'
import { UsersAwareState, UsersState } from 'types/users'
import { RelationOneToOne } from 'types/utilities'
import { Channel, ChannelMembership } from 'types/channels'
import { USERS_MODULE_NAME } from 'hkconstants'
import { createSelector } from 'reselect'

// Users
export const usersSelector = (state: UsersAwareState): UsersState => {
  return state[USERS_MODULE_NAME]
}

export const getCurrentUserId = createSelector(usersSelector, (users) => users.currentUserId)

export const getUserProfiles = createSelector(usersSelector, (users) => users.profiles)

export const getCurrentUser = createSelector(
  getUserProfiles,
  getCurrentUserId,
  (profiles, currentUserId) => profiles[currentUserId]
)

// export const getCurrentUser(state: UsersAwareState): UserProfile {
//   return state[USERS_MODULE_NAME].profiles[getCurrentUserId(state)]
// }
// export function getCurrentUserId(state: UsersAwareState): string {
//   return state[USERS_MODULE_NAME].currentUserId
// }

// export function getUserProfiles(state: UsersAwareState): IDMappedObjects<UserProfile> {
//   return state[USERS_MODULE_NAME].profiles
// }

export function getMyChannelMemberships(state: GlobalState): RelationOneToOne<Channel, ChannelMembership> {
  return state.entities.channels.myMembers
}

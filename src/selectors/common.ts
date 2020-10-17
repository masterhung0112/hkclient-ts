import { GlobalState } from 'types/store'
import { UsersAwareState, UsersState } from 'types/users'
import { RelationOneToOne } from 'types/utilities'
import { Channel, ChannelMembership } from 'types/channels'
import { UsersConstants } from 'hkconstants'
import { createSelector } from 'reselect'

// Users
export const usersSelector = (state: UsersAwareState): UsersState => {
  return state[UsersConstants.USERS_MODULE_NAME]
}

export const getCurrentUserId = createSelector(usersSelector, (users) => users.currentUserId)

export const getUsers = createSelector(usersSelector, (users) => users.profiles)

export const getCurrentUser = createSelector(
  getUsers,
  getCurrentUserId,
  (profiles, currentUserId) => profiles[currentUserId]
)

// export const getCurrentUser(state: UsersAwareState): UserProfile {
//   return state[UsersConstants.USERS_MODULE_NAME].profiles[getCurrentUserId(state)]
// }
// export function getCurrentUserId(state: UsersAwareState): string {
//   return state[UsersConstants.USERS_MODULE_NAME].currentUserId
// }

// export function getUsers(state: UsersAwareState): IDMappedObjects<UserProfile> {
//   return state[UsersConstants.USERS_MODULE_NAME].profiles
// }

export function getMyChannelMemberships(state: GlobalState): RelationOneToOne<Channel, ChannelMembership> {
  return state.entities.channels.myMembers
}

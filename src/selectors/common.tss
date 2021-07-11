import { GlobalState } from 'types/store'
import { UsersAwareState, UsersState } from 'types/users'
import { RelationOneToOne } from 'types/utilities'
import { Channel, ChannelMembership } from 'types/channels'
import { USERS_MODULE_NAME } from 'constants/users'
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

export function getMyChannelMemberships(state: GlobalState): RelationOneToOne<Channel, ChannelMembership> {
  return state.entities.channels.myMembers
}

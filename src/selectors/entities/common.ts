import { GlobalState } from 'types/store';
import { UserProfile } from 'types/users';
import { IDMappedObjects, RelationOneToOne } from 'types/utilities';
import { Channel, ChannelMembership } from 'types/channels';

// Users

export function getCurrentUser(state: GlobalState): UserProfile {
    return state.entities.users.profiles[getCurrentUserId(state)];
}

export function getCurrentUserId(state: GlobalState): string {
    return state.entities.users.currentUserId;
}

export function getUsers(state: GlobalState): IDMappedObjects<UserProfile> {
    return state.entities.users.profiles;
}

export function getMyChannelMemberships(state: GlobalState): RelationOneToOne<Channel, ChannelMembership> {
    return state.entities.channels.myMembers;
}
import { GenericAction } from 'types/actions'
import { combineReducers } from 'redux'
import { IDMappedObjects, RelationOneToOne, RelationOneToMany } from 'types/utilities'
import { UserProfile } from 'types/users'
import { UserTypes } from 'action-types'
import { Channel } from 'types/channels'

function currentUserId(state = '', action: GenericAction) {
  switch (action.type) {
    case UserTypes.RECEIVED_ME: {
      const data = action.data || action.payload

      return data.id
    }

    //     case UserTypes.LOGIN: {
    //       // Used by the mobile app
    //       const { user } = action.data

    //       return user ? user.id : state
    //     }
    //     case UserTypes.LOGOUT_SUCCESS:
    //       return ''
  }

  return state
}

function profiles(state: IDMappedObjects<UserProfile> = {}, action: GenericAction) {
  switch (action.type) {
    case UserTypes.RECEIVED_ME:
    case UserTypes.RECEIVED_PROFILE: {
      const data = action.data || action.payload
      const user = { ...data }
      const oldUser = state[data.id]
      if (oldUser) {
        user.terms_of_service_id = oldUser.terms_of_service_id
        user.terms_of_service_create_at = oldUser.terms_of_service_create_at
      }

      return {
        ...state,
        [data.id]: user,
      }
    }
  }
  return state
}

function profilesInChannel(state: RelationOneToMany<Channel, UserProfile> = {}, action: GenericAction) {
  switch (action.type) {
    // case UserTypes.RECEIVED_PROFILE_IN_CHANNEL:
    //     return addProfileToSet(state, action);

    // case UserTypes.RECEIVED_PROFILES_LIST_IN_CHANNEL:
    //     return profileListToSet(state, action);

    // case UserTypes.RECEIVED_PROFILES_IN_CHANNEL:
    //     return profilesToSet(state, action);

    // case UserTypes.RECEIVED_PROFILE_NOT_IN_CHANNEL:
    //     return removeProfileFromSet(state, action);

    // case ChannelTypes.CHANNEL_MEMBER_REMOVED:
    //     return removeProfileFromSet(state, {
    //         type: '',
    //         data: {
    //             id: action.data.channel_id,
    //             user_id: action.data.user_id,
    //         }});

    case UserTypes.LOGOUT_SUCCESS:
      return {}

    // case UserTypes.PROFILE_NO_LONGER_VISIBLE:
    //     return removeProfileFromTeams(state, action);

    // case UserTypes.RECEIVED_BATCHED_PROFILES_IN_CHANNEL: { // Used by the mobile  app
    //     const {data} = action;

    //     if (data && data.length) {
    //         const nextState: any = {...state};
    //         data.forEach((d: any) => {
    //             const {channelId, users} = d.data;
    //             const nextSet = new Set(state[channelId]);

    //             users.forEach((u: UserProfile) => nextSet.add(u.id));
    //             nextState[channelId] = nextSet;
    //         });

    //         return nextState;
    //     }

    //     return state;
    // }
    default:
      return state
  }
}

function statuses(state: RelationOneToOne<UserProfile, string> = {}, action: GenericAction) {
  switch (action.type) {
    // case UserTypes.RECEIVED_STATUS: {
    //     const nextState = Object.assign({}, state);
    //     nextState[action.data.user_id] = action.data.status;

    //     return nextState;
    // }
    // case UserTypes.RECEIVED_STATUSES: {
    //     const nextState = Object.assign({}, state);

    //     for (const s of action.data) {
    //         nextState[s.user_id] = s.status;
    //     }

    //     return nextState;
    // }
    case UserTypes.LOGOUT_SUCCESS:
      return {}
    // case UserTypes.PROFILE_NO_LONGER_VISIBLE: {
    //     if (state[action.data.user_id]) {
    //         const newState = {...state};
    //         delete newState[action.data.user_id];
    //         return newState;
    //     }
    //     return state;
    // }
    // case UserTypes.RECEIVED_BATCHED_PROFILES_IN_CHANNEL: { // Used by the mobile app
    //     const {data} = action;
    //     if (data && data.length) {
    //         const nextState = {...state};
    //         const ids = new Set();

    //         let hasNewStatuses = false;
    //         data.forEach((d: any) => {
    //             const {statuses: st} = d.data;
    //             if (st && st.length) {
    //                 st.forEach((u: UserStatus) => {
    //                     if (!ids.has(u.user_id)) {
    //                         ids.add(u.user_id);
    //                         nextState[u.user_id] = u.status;
    //                         hasNewStatuses = true;
    //                     }
    //                 });
    //             }
    //         });

    //         if (hasNewStatuses) {
    //             return nextState;
    //         }
    //     }

    //     return state;
    // }
    default:
      return state
  }
}

export default combineReducers({
  // the current selected user
  currentUserId,

  // object where every key is a user id and has an object with the users details
  profiles,

  // object where every key is a channel id and has a Set with the users id that are members of the channel
  profilesInChannel,

  // object where every key is the user id and has a value with the current status of each user
  statuses,
})

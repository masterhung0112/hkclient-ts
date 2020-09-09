import { Channel } from 'types/channels';
import { General } from '../constants';
import { UsersState, UserProfile } from 'types/users';
import { displayUsername } from './user_utils';
import { IDMappedObjects } from 'types/utilities';
import { GlobalState } from 'types/store';

export function isDirectChannel(channel: Channel): boolean {
    return channel.type === General.DM_CHANNEL;
}

export function getUserIdFromChannelName(userId: string, channelName: string): string {
    const ids = channelName.split('__');
    let otherUserId = '';
    if (ids[0] === userId) {
        otherUserId = ids[1];
    } else {
        otherUserId = ids[0];
    }

    return otherUserId;
}

export function isGroupChannel(channel: Channel): boolean {
    return channel.type === General.GM_CHANNEL;
}

export function completeDirectChannelInfo(usersState: UsersState, teammateNameDisplay: string, channel: Channel): Channel {
    if (isDirectChannel(channel)) {
        const teammateId = getUserIdFromChannelName(usersState.currentUserId, channel.name);

        // return empty string instead of `someone` default string for display_name
        return {
            ...channel,
            display_name: displayUsername(usersState.profiles[teammateId], teammateNameDisplay, false),
            teammate_id: teammateId,
            status: usersState.statuses[teammateId] || 'offline',
        };
    } else if (isGroupChannel(channel)) {
        return completeDirectGroupInfo(usersState, teammateNameDisplay, channel);
    }

    return channel;
}

function getUserLocale(userId: string, profiles: IDMappedObjects<UserProfile>) {
    let locale = General.DEFAULT_LOCALE;
    if (profiles && profiles[userId] && profiles[userId].locale) {
        locale = profiles[userId].locale;
    }

    return locale;
}

export function getGroupDisplayNameFromUserIds(userIds: Array<string>, profiles: IDMappedObjects<UserProfile>, currentUserId: string, teammateNameDisplay: string): string {
    const names: string[] = [];
    userIds.forEach((id) => {
        if (id !== currentUserId) {
            names.push(displayUsername(profiles[id], teammateNameDisplay));
        }
    });

    function sortUsernames(a: string, b: string) {
        const locale = getUserLocale(currentUserId, profiles);
        return a.localeCompare(b, locale, {numeric: true});
    }

    return names.sort(sortUsernames).join(', ');
}

function completeDirectGroupInfo(usersState: UsersState, teammateNameDisplay: string, channel: Channel) {
    const {currentUserId, profiles, profilesInChannel} = usersState;
    const profilesIds = profilesInChannel[channel.id];
    const gm = {...channel};

    if (profilesIds) {
        gm.display_name = getGroupDisplayNameFromUserIds(profilesIds, profiles, currentUserId, teammateNameDisplay);
        return gm;
    }

    const usernames = gm.display_name.split(', ');
    const users = Object.keys(profiles).map((key) => profiles[key]);
    const userIds: string[] = [];
    usernames.forEach((username: string) => {
        const u = users.find((p): boolean => p.username === username);
        if (u) {
            userIds.push(u.id);
        }
    });
    if (usernames.length === userIds.length) {
        gm.display_name = getGroupDisplayNameFromUserIds(userIds, profiles, currentUserId, teammateNameDisplay);
        return gm;
    }

    return channel;
}

export function getChannelsIdForTeam(state: GlobalState, teamId: string): Array<string> {
    const {channels} = state.entities.channels;

    return Object.keys(channels).map((key) => channels[key]).reduce((res, channel: Channel) => {
        if (channel.team_id === teamId) {
            res.push(channel.id);
        }
        return res;
    }, [] as string[]);
}
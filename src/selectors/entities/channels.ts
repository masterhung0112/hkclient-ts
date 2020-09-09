import { GlobalState } from 'types/store';
import { NameMappedObjects, RelationOneToMany, IDMappedObjects } from 'types/utilities';
import { Channel } from 'types/channels';
import { createSelector } from 'reselect';
import { Team } from 'types/teams';
import { UsersState } from 'types/users';
import { getTeammateNameDisplaySetting } from './preferences';
import { completeDirectChannelInfo } from 'utils/channel_utils';

export function getAllChannels(state: GlobalState): IDMappedObjects<Channel> {
    return state.entities.channels.channels;
}

export function getChannelsInTeam(state: GlobalState): RelationOneToMany<Team, Channel> {
    return state.entities.channels.channelsInTeam;
}

export const getChannelsNameMapInTeam: (state: GlobalState, teamId: string) => NameMappedObjects<Channel> = createSelector(
    getAllChannels,
    getChannelsInTeam,
    (state: GlobalState, teamId: string): string => teamId,
    (channels: IDMappedObjects<Channel>, channelsInTeams: RelationOneToMany<Team, Channel>, teamId: string): NameMappedObjects<Channel> => {
        const channelsInTeam = channelsInTeams[teamId] || [];
        const channelMap: NameMappedObjects<Channel> = {};
        channelsInTeam.forEach((id) => {
            const channel = channels[id];
            channelMap[channel.name] = channel;
        });
        return channelMap;
    },
)

export const getDirectChannelsSet: (state: GlobalState) => Set<string> = createSelector(
    getChannelsInTeam,
    (channelsInTeam: RelationOneToMany<Team, Channel>): Set<string> => {
        if (!channelsInTeam) {
            return new Set();
        }

        return new Set(channelsInTeam['']);
    },
)

// Returns both DMs and GMs
export const getAllDirectChannels: (state: GlobalState) => Array<Channel> = createSelector(
    getAllChannels,
    getDirectChannelsSet,
    (state: GlobalState): UsersState => state.entities.users,
    getTeammateNameDisplaySetting,
    (channels: IDMappedObjects<Channel>, channelSet: Set<string>, users: UsersState, teammateNameDisplay: string): Array<Channel> => {
        const dmChannels: Channel[] = [];
        channelSet.forEach((c) => {
            dmChannels.push(completeDirectChannelInfo(users, teammateNameDisplay, channels[c]));
        });
        return dmChannels;
    },
)
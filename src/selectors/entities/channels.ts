import { GlobalState } from 'types/store';
import { NameMappedObjects, RelationOneToMany, IDMappedObjects } from 'types/utilities';
import { Channel } from 'types/channels';
import { createSelector } from 'reselect';
import { Team } from 'types/teams';

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
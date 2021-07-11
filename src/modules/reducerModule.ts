// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {IModule} from 'redux-dynamic-modules-core';

import entitiesReducer from '../reducers/entities';
import errorsReducer from '../reducers/errors';
import requestsReducer from '../reducers/requests';
import websocketReducer from '../reducers/websocket';

import {GlobalState} from '../types/store';

export type EntityAwareState = GlobalState

export const EntitiesModule: IModule<EntityAwareState> = {
    id: 'entity',
    reducerMap: {
        entities: entitiesReducer as any,
        errors: errorsReducer as any,
        requests: requestsReducer as any,
        websocket: websocketReducer as any,
    },
};

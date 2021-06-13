// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {offline} from '@redux-offline/redux-offline';
import {Config} from '@redux-offline/redux-offline/lib/types';
import {IExtension} from 'redux-dynamic-modules-core';

export function getReduxOfflineExtension(offlineConfig: Partial<Config>): IExtension {
    const offlineMiddleware = offline(offlineConfig);

    return {
        middleware: [offlineMiddleware],
    };
}

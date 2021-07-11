// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import thunk from 'redux-thunk';
import {IExtension} from 'redux-dynamic-modules-core';

export function getThunkExtension(): IExtension {
    return {
        middleware: [thunk],
    };
}

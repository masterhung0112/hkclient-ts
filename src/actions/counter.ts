// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {AnyAction} from 'redux';
import {CounterTypes} from '../action-types';

export function setCount(payload: number): AnyAction {
    return {
        type: CounterTypes.SET_COUNT,
        payload,
    };
}

export default {
    setCount,
};

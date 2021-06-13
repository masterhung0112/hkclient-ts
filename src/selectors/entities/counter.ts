// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {CountAwareState} from 'types/counter';
import CounterConstants from 'constants/counter';

export const countSelector = (state: CountAwareState): number => {
    return state[CounterConstants.COUNT_MODULE_NAME].count;
};

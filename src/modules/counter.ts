// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {CountAwareState} from 'types/counter';
import {countReducer} from 'reducers/entities/counter';
import {countWatcher} from 'hksagas/counter';
import {ISagaModule} from 'saga-modular/contracts';
import CounterConstants from 'constants/counter';

export const CountModule: ISagaModule<CountAwareState> = {
    id: CounterConstants.COUNT_MODULE_NAME,
    reducerMap: {
        [CounterConstants.COUNT_MODULE_NAME]: countReducer,
    },
    sagas: [countWatcher],
};

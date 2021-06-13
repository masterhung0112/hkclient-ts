// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import CounterConstants from 'constants/counter';

export interface CountAwareState {
  [CounterConstants.COUNT_MODULE_NAME]: CountState;
}

export type CountState = Readonly<{
  count: number;
}>

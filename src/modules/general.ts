// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import generalReducer from 'reducers/entities/general';
import General from 'constants/general';
import {IModule} from 'redux-dynamic-modules-core';
import {GeneralAwareState} from 'types/general';

export const GeneralModule: IModule<GeneralAwareState> = {
    id: General.GENERAL_MODULE_NAME,
    reducerMap: {
        [General.GENERAL_MODULE_NAME]: generalReducer,
    },
};

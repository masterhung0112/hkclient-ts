// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {Task} from 'redux-saga';

export const allSagasDone = (sagaTasks: Task[]): Promise<any> => {
    return Promise.all(
        sagaTasks.
            map((task) => task.toPromise()).
            map((taskPromise) =>
                taskPromise.
                    then((value) => {
                        return {
                            status: 'fulfilled',
                            value,
                        };
                    }).
                    catch((reason) => ({
                        status: 'rejected',
                        reason,
                    })),
            ),
    );
};

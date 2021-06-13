// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
export type RequestStatusOption = 'not_started' | 'started' | 'success' | 'failure' | 'cancelled'
export type RequestStatusType = {
  status: RequestStatusOption;
  error: null | Record<string, any>;
}

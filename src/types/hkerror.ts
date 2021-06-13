// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
export type HkError = {
  intl?: {
    id: string;
    defaultMessage: string;
    values?: any;
  };
  message: string;
}

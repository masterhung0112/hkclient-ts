import TestHelper from 'test/test_helper'
import configureStore from 'test/test_store'
import { HkClient } from "hkclient"
import * as Actions from 'actions/users'
import nock from 'nock'
import assert from 'assert';

describe('Actions.Users', () => {
    let store;
    beforeAll(async () => {
        await TestHelper.initBasic(HkClient);
    });

    beforeEach(async () => {
        store = await configureStore();
    });

    afterAll(async () => {
        await TestHelper.tearDown();
    })

    it('getMe', async () => {
        nock(HkClient.baseRoute).
            get('/users/me').
            reply(200, TestHelper.basicUser);

        await Actions.getMe()(store.dispatch, store.getState);

        const state = store.getState();
        const {profiles, currentUserId} = state.entities.users;

        assert.ok(profiles[currentUserId]);
        assert.equal(profiles[currentUserId].id, currentUserId);
    })
})
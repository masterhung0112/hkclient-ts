import TestHelper from 'testlib/test_helper'
import configureStore from 'testlib/test_store'
import { HkClient } from 'hkclient'
import * as Actions from 'actions/users'
import nock from 'nock'
import assert from 'assert'
import { UsersModule } from 'hkmodules/users'
import { getCurrentUserId, getUserProfiles } from 'selectors/users'

describe('Actions.Users', () => {
  let store
  beforeAll(async () => {
    await TestHelper.initBasic(HkClient)
  })

  beforeEach(async () => {
    store = await configureStore([UsersModule])
  })

  afterAll(async () => {
    await TestHelper.tearDown()
  })

  it('getMe', async () => {
    nock(HkClient.baseRoute).get('/users/me').reply(200, TestHelper.basicUser)

    await Actions.getMe()(store.dispatch, store.getState)

    const state = store.getState()
    const profiles = getUserProfiles(state)
    const currentUserId = getCurrentUserId(state)

    assert.ok(profiles[currentUserId])
    assert.equal(profiles[currentUserId].id, currentUserId)
  })

  it('getUserByUsername', async () => {
    nock(HkClient.baseRoute).post('/users').reply(200, TestHelper.fakeUserWithId())

    const user = await TestHelper.basicClient.createUser(TestHelper.fakeUser())

    nock(HkClient.baseRoute).get(`/users/username/${user.username}`).reply(200, user)

    await Actions.getUserByUsername(user.username)(store.dispatch, store.getState)

    const state = store.getState()
    const profiles = getUserProfiles(state)

    assert.ok(profiles[user.id])
    assert.equal(profiles[user.id].username, user.username)
  })

  it('getUserByEmail', async () => {
    nock(HkClient.baseRoute).post('/users').reply(200, TestHelper.fakeUserWithId())

    const user = await TestHelper.basicClient.createUser(TestHelper.fakeUser())

    nock(HkClient.baseRoute).get(`/users/email/${user.email}`).reply(200, user)

    await Actions.getUserByEmail(user.email)(store.dispatch, store.getState)

    const state = store.getState()
    const profiles = getUserProfiles(state)

    assert.ok(profiles[user.id])
    assert.equal(profiles[user.id].email, user.email)
  })
})

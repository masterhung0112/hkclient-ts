import TestHelper from 'testlib/test_helper'
import configureStore from 'testlib/test_store'
import { HkClient } from 'hkclient'
import * as Actions from 'actions/users'
import nock from 'nock'
import assert from 'assert'
import { UsersModule } from 'hkmodules/users'
import { getCurrentUserId, getUserProfiles } from 'selectors/users'
import { SagaStore } from 'types/store'
import { allSagasDone } from 'hkredux'

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

    store.dispatch(Actions.getMe())
    await allSagasDone((store as SagaStore).getSagaTasks())

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

    store.dispatch(Actions.getUserByUsername(user.username))

    // Wait for all saga done
    const tasks = (store as SagaStore).getSagaTasks()
    expect(tasks).toBeTruthy()
    expect(tasks.length).toEqual(1)
    await allSagasDone(tasks)

    const profiles = getUserProfiles(store.getState())

    expect(profiles[user.id]).toBeTruthy()
    expect(profiles[user.id].username).toEqual(user.username)
  })

  it('getUserByEmail', async () => {
    nock(HkClient.baseRoute).post('/users').reply(200, TestHelper.fakeUserWithId())

    const user = await TestHelper.basicClient.createUser(TestHelper.fakeUser())

    nock(HkClient.baseRoute).get(`/users/email/${user.email}`).reply(200, user)

    // await Actions.getUserByEmail(user.email)(store.dispatch, store.getState)
    store.dispatch(Actions.getUserByEmail(user.email))
    await allSagasDone((store as SagaStore).getSagaTasks())

    const state = store.getState()
    const profiles = getUserProfiles(state)

    assert.ok(profiles[user.id])
    assert.equal(profiles[user.id].email, user.email)
  })
})

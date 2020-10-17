import TestHelper from 'testlib/test_helper'
import configureStore from 'testlib/test_store'
import { HkClient } from 'hkclient'
import * as Actions from 'actions/general'
import nock from 'nock'
import assert from 'assert'

describe('general actions', () => {
  let store
  beforeAll(async () => {
    await TestHelper.initBasic(HkClient)
  })

  beforeEach(async () => {
    store = await configureStore([])
  })

  afterAll(async () => {
    await TestHelper.tearDown()
  })

  it('getClientConfig', async () => {
    nock(HkClient.baseRoute)
      .get('/config/client')
      .query(true)
      .reply(200, { Version: '4.0.0', BuildNumber: '3', BuildDate: 'Yesterday', BuildHash: '1234' })

    await Actions.getClientConfig()(store.dispatch, store.getState)

    const clientConfig = store.getState().entities.general.config

    // Check a few basic fields since they may change over time
    assert.ok(clientConfig.Version)
    assert.ok(clientConfig.BuildNumber)
    assert.ok(clientConfig.BuildDate)
    assert.ok(clientConfig.BuildHash)
  })
})

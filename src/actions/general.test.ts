import TestHelper from 'testlib/test_helper'
import configureStore from 'testlib/test_store'
import { HkClient } from 'hkclient'
import * as Actions from 'actions/general'
import nock from 'nock'
import { IModuleStore } from 'redux-dynamic-modules-core'

describe('general actions', () => {
  let store: IModuleStore<any>
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
    expect(clientConfig.Version).toBeTruthy()
    expect(clientConfig.BuildNumber).toBeTruthy()
    expect(clientConfig.BuildDate).toBeTruthy()
    expect(clientConfig.BuildHash).toBeTruthy()
  })
})

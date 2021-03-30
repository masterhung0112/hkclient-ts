import TestHelper from 'testlib/test_helper'
import configureStore from 'testlib/test_store'
import { Client4 } from 'client'
import * as Actions from 'actions/general'
import nock from 'nock'
import { IModuleStore } from 'redux-dynamic-modules-core'
import { GeneralSelectors } from 'selectors'
import { ClientConfig } from 'types/config'
import { GeneralModule } from 'hkmodules/general'

describe('general actions', () => {
  let store: IModuleStore<any>
  beforeAll(async () => {
    await TestHelper.initBasic(Client4)
  })

  beforeEach(async () => {
    store = await configureStore([GeneralModule])
  })

  afterAll(async () => {
    await TestHelper.tearDown()
  })

  it('getClientConfig', async () => {
    nock(Client4.getBaseRoute())
      .get('/config/client')
      .query(true)
      .reply(200, { SiteURL: 'hungknowtest', DiagnosticId: '123' } as Partial<ClientConfig>)

    await Actions.getClientConfig()(store.dispatch, store.getState)

    const clientConfig = GeneralSelectors.getConfig(store.getState())

    // Check a few basic fields since they may change over time
    expect(clientConfig.SiteURL).toBeTruthy()
    expect(clientConfig.DiagnosticId).toBeTruthy()
    expect(clientConfig.CustomDescriptionText).toBeFalsy()
  })
})

import { ClientError, HEADER_X_VERSION_ID } from './hkclient'
import assert from 'assert'
import nock from 'nock'
import TestHelper from 'test/test_helper'

describe('HkClient', () => {
  beforeAll(() => {
    if (!nock.isActive()) {
      nock.activate()
    }
  })

  afterAll(() => {
    nock.restore()
  })

  describe('doFetchWithResponse', () => {
    it('serverVersion should set from response header', async () => {
      const client = TestHelper.createClient()

      assert.equal(client.serverVersion, '')

      nock(client.baseRoute)
        .get('/users/me')
        .reply(200, '{}', { [HEADER_X_VERSION_ID]: '5.0.0.5.0.0.abc123' })

      await client.getMe()

      // Change the version of server version
      assert.equal(client.serverVersion, '5.0.0.5.0.0.abc123')

      nock(client.baseRoute)
        .get('/users/me')
        .reply(200, '{}', { [HEADER_X_VERSION_ID]: '5.3.0.5.3.0.abc123' })

      await client.getMe()

      assert.equal(client.serverVersion, '5.3.0.5.3.0.abc123')
    })
  })
})

describe('ClientError', () => {
  it('standard fields should be enumerable', () => {
    const error = new ClientError('https://example.com', {
      message: 'This is a message',
      intl: {
        id: 'test.error',
        defaultMessage: 'This is a message with a translation',
      },
      server_error_id: 'test.app_error',
      status_code: 418,
      url: 'https://example.com/api/v4/error',
    })

    const copy = { ...error }
    assert.strictEqual(copy.message, error.message)
    assert.strictEqual(copy.intl, error.intl)
    assert.strictEqual(copy.server_error_id, error.server_error_id)
    assert.strictEqual(copy.status_code, error.status_code)
    assert.strictEqual(copy.url, error.url)
  })
})

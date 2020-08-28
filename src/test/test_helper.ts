import HkClient from 'hkclient/hkclient'

export const DEFAULT_SERVER = 'http://localhost:8065'

class TestHelper {
  basicClient = null

  createClient = () => {
    const client = new HkClient()

    client.url = DEFAULT_SERVER

    return client
  }
}

export default new TestHelper()

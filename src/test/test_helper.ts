import nock from 'nock'
import HkClient from 'hkclient/hkclient'
import { generateId } from 'utils/helpers'
import { DEFAULT_LOCALE } from 'constants/general'

export const DEFAULT_SERVER = 'http://localhost:8065'
const PASSWORD = 'password1'

class TestHelper {
  basicClient = null
  basicUser = null

  createClient = () => {
    const client = new HkClient()

    client.url = DEFAULT_SERVER

    return client
  }

  activateMocking() {
    if (!nock.isActive()) {
        nock.activate();
    }
  }

  initBasic = async (hkClient = this.createClient()) => {
    hkClient.url = DEFAULT_SERVER
    this.basicClient = hkClient

    this.activateMocking()

    return {
      hkclient: this.basicClient,
      // user: this.basicUser,
      // team: this.basicTeam,
      // channel: this.basicChannel,
      // post: this.basicPost,
    }
  }

  tearDown = async () => {
    nock.restore();

    this.basicClient = null;
    // this.basicUser = null;
    // this.basicTeam = null;
    // this.basicTeamMember = null;
    // this.basicChannel = null;
    // this.basicChannelMember = null;
    // this.basicPost = null;
  }

  generateId = () => {
    return generateId();
  }

  fakeEmail = () => {
    return 'success' + this.generateId() + '@simulator.amazonses.com';
  }

  fakeUser = () => {
    return {
        email: this.fakeEmail(),
        allow_marketing: true,
        password: PASSWORD,
        locale: DEFAULT_LOCALE,
        username: this.generateId(),
        first_name: this.generateId(),
        last_name: this.generateId(),
        create_at: Date.now(),
        delete_at: 0,
        roles: 'system_user',
    };
  }

  fakeUserWithId = (id = this.generateId()) => {
    return {
        ...this.fakeUser(),
        id,
        create_at: 1507840900004,
        update_at: 1507840900004,
        delete_at: 0,
    };
}

  initMockEntities = () => {
    this.basicUser = this.fakeUserWithId();
    this.basicUser.roles = 'system_user system_admin'
  }
}

export default new TestHelper()

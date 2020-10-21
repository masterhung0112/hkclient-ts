import nock from 'nock'
import HkClient from 'hkclient/hkclient'
import { generateId } from 'utils/helpers'
import { General } from '../constants'
import { UserProfile } from 'types/users'

export const DEFAULT_SERVER = 'http://localhost:8065'
const PASSWORD = 'password1'

class TestHelper {
  basicClient: HkClient
  basicUser = null

  createClient = () => {
    const client = new HkClient()

    client.url = DEFAULT_SERVER

    return client
  }

  activateMocking() {
    if (!nock.isActive()) {
      nock.activate()
    }
  }

  initBasic = async (hkClient = this.createClient()) => {
    hkClient.url = DEFAULT_SERVER
    this.basicClient = hkClient

    this.activateMocking()
    this.initMockEntities()

    return {
      hkclient: this.basicClient,
      // user: this.basicUser,
      // team: this.basicTeam,
      // channel: this.basicChannel,
      // post: this.basicPost,
    }
  }

  tearDown = async () => {
    nock.restore()

    this.basicClient = null
    // this.basicUser = null;
    // this.basicTeam = null;
    // this.basicTeamMember = null;
    // this.basicChannel = null;
    // this.basicChannelMember = null;
    // this.basicPost = null;
  }

  generateId = () => {
    return generateId()
  }

  fakeEmail = () => {
    return 'success' + this.generateId() + '@simulator.amazonses.com'
  }

  fakeUser = (): UserProfile => {
    const now = Date.now()
    return {
      id: this.generateId(),
      create_at: now,
      update_at: now,
      delete_at: 0,
      username: this.generateId(),
      password: PASSWORD,
      auth_data: '',
      auth_service: '',
      email: this.fakeEmail(),
      email_verified: true,
      nickname: this.generateId(),
      first_name: this.generateId(),
      last_name: this.generateId(),
      position: '',
      roles: 'system_user',
      allow_marketing: true,
      last_password_update: now,
      last_picture_update: now,
      failed_attempts: 0,
      locale: General.DEFAULT_LOCALE,
      mfa_active: false,
      mfa_secret: '',
      last_activity_at: now,
      is_bot: false,
      bot_description: '',
      bot_last_icon_update: now,
      terms_of_service_id: '',
      terms_of_service_create_at: now,
    }
  }

  fakeUserWithId = (id = this.generateId()) => {
    return {
      ...this.fakeUser(),
      id,
      create_at: 1507840900004,
      update_at: 1507840900004,
      delete_at: 0,
    }
  }

  initMockEntities = () => {
    this.basicUser = this.fakeUserWithId()
    this.basicUser.roles = 'system_user system_admin'
  }
}

export default new TestHelper()

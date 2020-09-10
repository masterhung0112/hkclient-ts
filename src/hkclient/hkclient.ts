import { UserProfile } from 'types/users'

import { Options, ClientResponse } from 'types/hkclient'
import { ServerError } from 'types/errors'
import { cleanUrlForLogging } from 'utils/sentry'
import { buildQueryString } from 'utils/helpers'
import fetch from 'cross-fetch'
import { ClientConfig } from 'types/config'
import { PreferenceType } from 'types/preferences'
import { Role } from 'types/roles'
import { Channel, ChannelMembership } from 'types/channels'

const HEADER_AUTH = 'Authorization'
const HEADER_BEARER = 'BEARER'
const HEADER_REQUESTED_WITH = 'X-Requested-With'
const HEADER_USER_AGENT = 'User-Agent'
const HEADER_X_CLUSTER_ID = 'X-Cluster-Id'
const HEADER_X_CSRF_TOKEN = 'X-CSRF-Token'
export const HEADER_X_VERSION_ID = 'X-Version-Id'

export default class HkClient {
  logToConsole = false
  userIdValue = ''
  userRolesVal?: string;

  serverVersionVal = ''
  urlVal = ''
  urlVersion = '/api/v1'
  defaultHeaders: { [x: string]: string } = {}
  token = ''
  includeCookies = true
  enableLogging = false

  set userId(userId: string) {
    this.userIdValue = userId
  }

  get userId() {
    return this.userIdValue
  }

  set userRoles(roles: string) {
    this.userRolesVal = roles
  }

  get userRoles() {
    return this.userRolesVal
  }

  get url() {
    return this.urlVal
  }

  set url(value: string) {
    this.urlVal = value
  }

  get serverVersion() {
    return this.serverVersionVal
  }

  set serverVersion(value: string) {
    this.serverVersionVal = value
  }

  get baseRoute() {
    return `${this.url}${this.urlVersion}`
  }

  get usersRoute() {
    return `${this.baseRoute}/users`
  }

  getUserRoute(userId: string) {
    return `${this.usersRoute}/${userId}`
  }

  getPreferencesRoute(userId: string) {
    return `${this.getUserRoute(userId)}/preferences`;
  }

  get rolesRoute() {
    return `${this.baseRoute}/roles`
  }

  getChannelsRoute() {
    return `${this.baseRoute}/channels`;
  }

  getChannelRoute(channelId: string) {
    return `${this.getChannelsRoute()}/${channelId}`;
  }

  getChannelMembersRoute(channelId: string) {
    return `${this.getChannelRoute(channelId)}/members`;
  }

  getChannelMemberRoute(channelId: string, userId: string) {
    return `${this.getChannelMembersRoute(channelId)}/${userId}`;
  }

  getTeamsRoute() {
    return `${this.baseRoute}/teams`;
  }

  getTeamRoute(teamId: string) {
      return `${this.getTeamsRoute()}/${teamId}`;
  }

  getTeamSchemeRoute(teamId: string) {
      return `${this.getTeamRoute(teamId)}/scheme`;
  }

  getTeamNameRoute(teamName: string) {
      return `${this.getTeamsRoute()}/name/${teamName}`;
  }

  /***
   * User Routes
   */

  createUser = (user: UserProfile, token: string, inviteId: string, redirect: string) => {
    // this.trackEvent('api', 'api_users_create');

    const queryParams: any = {}

    if (token) {
      queryParams.t = token
    }

    if (inviteId) {
      queryParams.iid = inviteId
    }

    if (redirect) {
      queryParams.r = redirect
    }

    return this.doFetch<UserProfile>(`${this.usersRoute}${buildQueryString(queryParams)}`, {
      method: 'post',
      body: JSON.stringify(user),
    })
  }

  login = (loginId: string, password: string, token = '', deviceId = '', ldapOnly = false) => {
    const body: any = {
      device_id: deviceId,
      login_id: loginId,
      password,
      token,
    }

    return this.doFetch<UserProfile>(`${this.usersRoute}/login`, { method: 'post', body: JSON.stringify(body) })
  }

  getMe = () => {
    return this.doFetch<UserProfile>(`${this.getUserRoute('me')}`, { method: 'get' })
  }

  getUserByUsername = (username: string) => {
    return this.doFetch<UserProfile>(
        `${this.usersRoute}/username/${username}`,
        {method: 'get'},
    );
  }

  getUserByEmail = (email: string) => {
    return this.doFetch<UserProfile>(
        `${this.usersRoute}/email/${email}`,
        {method: 'get'},
    );
  }

  getClientConfigOld = () => {
      return this.doFetch<ClientConfig>(
          `${this.baseRoute}/config/client?format=old`,
          {method: 'get'},
      );
  };

  getMyPreferences = () => {
    return this.doFetch<PreferenceType>(
        `${this.getPreferencesRoute('me')}`,
        {method: 'get'},
    );
  }

  getRolesByNames = (rolesNames: string[]) => {
    return this.doFetch<Role[]>(
        `${this.rolesRoute}/names`,
        {method: 'post', body: JSON.stringify(rolesNames)},
    );
  }

  getMyChannels = (teamId: string, includeDeleted = false) => {
    return this.doFetch<Channel[]>(
        `${this.getUserRoute('me')}/teams/${teamId}/channels${buildQueryString({include_deleted: includeDeleted})}`,
        {method: 'get'},
    );
  }

  getMyChannelMember = (channelId: string) => {
    return this.doFetch<ChannelMembership>(
        `${this.getChannelMemberRoute(channelId, 'me')}`,
        {method: 'get'},
    );
  }

  getMyChannelMembers = (teamId: string) => {
    return this.doFetch<ChannelMembership[]>(
        `${this.getUserRoute('me')}/teams/${teamId}/channels/members`,
        {method: 'get'},
    );
  }

  getChannelByNameAndTeamName = (teamName: string, channelName: string, includeDeleted = false) => {
    // this.trackEvent('api', 'api_channel_get_by_name_and_teamName', {include_deleted: includeDeleted});

    return this.doFetch<Channel>(
        `${this.getTeamNameRoute(teamName)}/channels/name/${channelName}?include_deleted=${includeDeleted}`,
        {method: 'get'},
    );
  }

  /********
   * Client Helpers
   */

  getOptions(options: Options) {
    const newOptions: Options = { ...options }

    // create the initial headers
    const headers: { [x: string]: string } = {
      [HEADER_REQUESTED_WITH]: 'XMLHttpRequest',
      ...this.defaultHeaders,
    }

    if (this.token) {
      headers[HEADER_AUTH] = `${HEADER_BEARER} ${this.token}`
    }

    if (this.includeCookies) {
      newOptions.credentials = 'include'
    }

    if (newOptions.headers) {
      Object.assign(headers, newOptions.headers)
    }

    return {
      ...newOptions,
      headers,
    }
  }

  doFetch = async <T>(url: string, options: Options): Promise<T> => {
    const { data } = await this.doFetchWithResponse<T>(url, options)

    return data
  }

  doFetchWithResponse = async <T>(url: string, options: Options): Promise<ClientResponse<T>> => {
    const response = await fetch(url, this.getOptions(options))
    const headers = parseAndMergeNestedHeaders(response.headers)

    let data
    try {
      data = await response.json()
    } catch (err) {
      // Throw exception when fail to convert message into json
      throw new ClientError(this.url, {
        message: 'Received invalid response from the server.',
        intl: {
            id: 'mobile.request.invalid_response',
            defaultMessage: 'Received invalid response from the server.',
        },
        url,
      });
    }

    if (headers.has(HEADER_X_VERSION_ID) && !headers.get('Cache-Control')) {
      const serverVersion = headers.get(HEADER_X_VERSION_ID)
      if (serverVersion && this.serverVersion !== serverVersion) {
        this.serverVersion = serverVersion
      }
    }

    if (response.ok) {
      return {
        response,
        headers,
        data,
      }
    }

    const msg = data.message || ''

    if (this.logToConsole) {
      console.error(msg) // eslint-disable-line no-console
    }

    throw new ClientError(this.url, {
      message: msg,
      server_error_id: data.id,
      status_code: data.status_code,
      url,
    })
  }

  logClientError = (message: string, level = 'ERROR') => {
    const url = `${this.baseRoute}/logs`;

    if (!this.enableLogging) {
        throw new ClientError(this.url, {
            message: 'Logging disabled.',
            url,
        });
    }

    return this.doFetch<{
        message: string;
    }>(
        url,
        {method: 'post', body: JSON.stringify({message, level})},
    );
  }
}

export class ClientError extends Error implements ServerError {
  url?: string
  intl?: {
    id: string
    defaultMessage: string
    values?: any
  }
  server_error_id?: string
  status_code?: number

  constructor(baseUrl: string, data: ServerError) {
    super(data.message + ': ' + cleanUrlForLogging(baseUrl, data.url || ''))

    this.message = data.message
    this.url = data.url
    this.intl = data.intl
    this.server_error_id = data.server_error_id
    this.status_code = data.status_code

    // Ensure message is treated as a property of this class when object spreading. Without this,
    // copying the object by using `{...error}` would not include the message.
    Object.defineProperty(this, 'message', { enumerable: true })
  }
}

function parseAndMergeNestedHeaders(originalHeaders: any) {
  const headers = new Map()
  let nestedHeaders = new Map()
  originalHeaders.forEach((val: string, key: string) => {
    const capitalizedKey = key.replace(/\b[a-z]/g, (l) => l.toUpperCase())
    let realVal = val
    if (val && val.match(/\n\S+:\s\S+/)) {
      const nestedHeaderStrings = val.split('\n')
      realVal = nestedHeaderStrings.shift() as string
      const moreNestedHeaders = new Map(nestedHeaderStrings.map((h: any) => h.split(/:\s/)))
      nestedHeaders = new Map([...nestedHeaders, ...moreNestedHeaders])
    }
    headers.set(capitalizedKey, realVal)
  })
  return new Map([...headers, ...nestedHeaders])
}

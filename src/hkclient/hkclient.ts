import { UserProfile } from 'types/users'

import { Options, ClientResponse } from 'types/hkclient'
import { ServerError } from 'types/errors'
import { cleanUrlForLogging } from 'utils/sentry'
import { buildQueryString } from 'utils/helpers'
import fetch from 'cross-fetch'

const HEADER_AUTH = 'Authorization'
const HEADER_BEARER = 'BEARER'
const HEADER_REQUESTED_WITH = 'X-Requested-With'
const HEADER_USER_AGENT = 'User-Agent'
const HEADER_X_CLUSTER_ID = 'X-Cluster-Id'
const HEADER_X_CSRF_TOKEN = 'X-CSRF-Token'
export const HEADER_X_VERSION_ID = 'X-Version-Id'

export default class HkClient {
  logToConsole = false
  serverVersionVal = ''
  urlVal = ''
  urlVersion = '/api/v1'
  defaultHeaders: { [x: string]: string } = {}
  token = ''
  includeCookies = true

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
      data = response.json()
    } catch (err) {
      // Throw exception when fail to convert message into json
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

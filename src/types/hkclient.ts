export type logLevel = 'ERROR' | 'WARNING' | 'INFO'

type ErrorOffline = {
  message: string
  url: string
}
type ErrorInvalidResponse = {
  intl: {
    id: string
    defaultMessage: string
  }
}
export type ErrorApi = {
  message: string
  server_error_id: string
  status_code: number
  url: string
}
export type Client4Error = ErrorOffline | ErrorInvalidResponse | ErrorApi

export type ClientResponse<T> = {
  response: Response
  headers: Map<string, string>
  data: T
}

export type Options = {
  headers?: { [x: string]: string }
  method?: string
  url?: string
  credentials?: 'omit' | 'same-origin' | 'include'
  body?: any
}

export type StatusOK = {
  status: 'OK'
}

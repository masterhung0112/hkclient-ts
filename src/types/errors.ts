export type ServerError = {
  server_error_id?: string
  stack?: string
  intl?: {
    id: string
    defaultMessage: string
    values?: unknown
  }
  message: string
  status_code?: number
  url?: string
}

export type HkError = {
  intl?: {
    id: string
    defaultMessage: string
    values?: any
  },
  message: string
}
export type RequestStatusOption = 'not_started' | 'started' | 'success' | 'failure' | 'cancelled'
export type RequestStatusType = {
  status: RequestStatusOption
  error: null | Record<string, any>
}

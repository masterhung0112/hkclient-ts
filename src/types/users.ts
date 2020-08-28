export type UserProfile = {
  id: string
  create_at: number
  update_at: number
  delete_at: number
  username: string
  password: string
  auth_data: string
  auth_service: string
  email: string
  email_verified: boolean
  nickname: string
  first_name: string
  last_name: string
  position: string
  roles: string
  allow_marketing: boolean
  // props: Dictionary<string>;
  // notify_props: UserNotifyProps;
  last_password_update: number
  last_picture_update: number
  failed_attempts: number
  locale: string
  // timezone?: UserTimezone;
  mfa_active: boolean
  mfa_secret: string
  last_activity_at: number
  is_bot: boolean
  bot_description: string
  bot_last_icon_update: number
  terms_of_service_id: string
  terms_of_service_create_at: number
}

export type UsersState = {
  currentUserId: string
}

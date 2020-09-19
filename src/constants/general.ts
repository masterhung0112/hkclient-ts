export default {
  OFFLINE_STORE_RESET: 'offline_store_reset',
  DEFAULT_LOCALE: 'en',
  TEAMMATE_NAME_DISPLAY: {
    SHOW_USERNAME: 'username',
    SHOW_NICKNAME_FULLNAME: 'nickname_full_name',
    SHOW_FULLNAME: 'full_name',
  },
  DEFAULT_CHANNEL: 'town-square',
  DM_CHANNEL: 'D',
  GM_CHANNEL: 'G',


  /**
   * Data-related constraint
   */
  MIN_TEAMNAME_LENGTH: 2,
  MAX_TEAMNAME_LENGTH: 15,
  MAX_TEAMDESCRIPTION_LENGTH: 50,
  MIN_CHANNELNAME_LENGTH: 2,
  MAX_CHANNELNAME_LENGTH: 64,
  MAX_FIRSTNAME_LENGTH: 64,
  MAX_LASTNAME_LENGTH: 64,
  MAX_EMAIL_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 22,
  MAX_NICKNAME_LENGTH: 22,
  MIN_PASSWORD_LENGTH: 5,
  MAX_PASSWORD_LENGTH: 64,
  MAX_POSITION_LENGTH: 128,

  RESERVED_USERNAMES: [
    'valet',
    'all',
    'channel',
    'here',
    'hungknowbot',
    'system',
  ],
}

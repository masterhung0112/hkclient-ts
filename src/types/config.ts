export type ClientConfig = {
  SiteURL: string
  DiagnosticId: string
  DefaultClientLocale: string
  TeammateNameDisplay: string
  LockTeammateNameDisplay: string
  NoAccounts: string
  EnableSignUpWithEmail: string
  SiteName: string
  TermsOfServiceLink: string
  PrivacyPolicyLink: string
  CustomDescriptionText: string
  PasswordMinimumLength: string
  PasswordRequireLowercase: string
  PasswordRequireUppercase: string
  PasswordRequireNumber: string
  PasswordRequireSymbol: string
}

export type ClientLicense = Record<string, string>

export type PasswordConfig = {
  minimumLength: number
  requireLowercase: boolean
  requireNumber: boolean
  requireSymbol: boolean
  requireUppercase: boolean
}

export type ServiceSettings = {
  SiteURL: string
  WebsocketURL: string
  LicenseFileLocation: string
  ListenAddress: string
  ConnectionSecurity: string
  TLSCertFile: string
  TLSKeyFile: string
  TLSMinVer: string
  TLSStrictTransport: boolean
  TLSStrictTransportMaxAge: number
  TLSOverwriteCiphers: string[]
  UseLetsEncrypt: boolean
  LetsEncryptCertificateCacheFile: string
  Forward80To443: boolean
  TrustedProxyIPHeader: string[]
  ReadTimeout: number
  WriteTimeout: number
  IdleTimeout: number
  MaximumLoginAttempts: number
  GoroutineHealthThreshold: number
  GoogleDeveloperKey: string
  EnableOAuthServiceProvider: boolean
  EnableIncomingWebhooks: boolean
  EnableOutgoingWebhooks: boolean
  EnableCommands: boolean
  EnableOnlyAdminIntegrations: boolean
  EnablePostUsernameOverride: boolean
  EnablePostIconOverride: boolean
  EnableLinkPreviews: boolean
  EnableTesting: boolean
  EnableDeveloper: boolean
  EnableOpenTracing: boolean
  EnableSecurityFixAlert: boolean
  EnableInsecureOutgoingConnections: boolean
  AllowedUntrustedInternalConnections: string
  EnableMultifactorAuthentication: boolean
  EnforceMultifactorAuthentication: boolean
  EnableUserAccessTokens: boolean
  AllowCorsFrom: string
  CorsExposedHeaders: string
  CorsAllowCredentials: boolean
  CorsDebug: boolean
  AllowCookiesForSubdomains: boolean
  ExtendSessionLengthWithActivity: boolean
  SessionLengthWebInDays: number
  SessionLengthMobileInDays: number
  SessionLengthSSOInDays: number
  SessionCacheInMinutes: number
  SessionIdleTimeoutInMinutes: number
  WebsocketSecurePort: number
  WebsocketPort: number
  WebserverMode: string
  EnableCustomEmoji: boolean
  EnableEmojiPicker: boolean
  EnableGifPicker: boolean
  GfycatApiKey: string
  GfycatApiSecret: string
  RestrictCustomEmojiCreation: string
  RestrictPostDelete: string
  AllowEditPost: string
  PostEditTimeLimit: number
  TimeBetweenUserTypingUpdatesMilliseconds: number
  EnablePostSearch: boolean
  MinimumHashtagLength: number
  EnableUserTypingMessages: boolean
  EnableChannelViewedMessages: boolean
  EnableUserStatuses: boolean
  ExperimentalEnableAuthenticationTransfer: boolean
  ClusterLogTimeoutMilliseconds: number
  CloseUnusedDirectMessages: boolean
  EnablePreviewFeatures: boolean
  EnableTutorial: boolean
  ExperimentalEnableDefaultChannelLeaveJoinMessages: boolean
  ExperimentalGroupUnreadChannels: string
  ExperimentalChannelOrganization: boolean
  ExperimentalChannelSidebarOrganization: string
  ExperimentalDataPrefetch: boolean
  ImageProxyType: string
  ImageProxyURL: string
  ImageProxyOptions: string
  EnableAPITeamDeletion: boolean
  ExperimentalEnableHardenedMode: boolean
  DisableLegacyMFA: boolean
  ExperimentalStrictCSRFEnforcement: boolean
  EnableEmailInvitations: boolean
  DisableBotsWhenOwnerIsDeactivated: boolean
  EnableBotAccountCreation: boolean
  EnableSVGs: boolean
  EnableLatex: boolean
  EnableLocalMode: boolean
  LocalModeSocketLocation: string
}

export type TeamSettings = {
  SiteName: string
  MaxUsersPerTeam: number
  EnableTeamCreation: boolean
  EnableUserCreation: boolean
  EnableOpenServer: boolean
  EnableUserDeactivation: boolean
  RestrictCreationToDomains: string
  EnableCustomBrand: boolean
  CustomBrandText: string
  CustomDescriptionText: string
  RestrictDirectMessage: string
  RestrictTeamInvite: string
  RestrictPublicChannelManagement: string
  RestrictPrivateChannelManagement: string
  RestrictPublicChannelCreation: string
  RestrictPrivateChannelCreation: string
  RestrictPublicChannelDeletion: string
  RestrictPrivateChannelDeletion: string
  RestrictPrivateChannelManageMembers: string
  EnableXToLeaveChannelsFromLHS: boolean
  UserStatusAwayTimeout: number
  MaxChannelsPerTeam: number
  MaxNotificationsPerChannel: number
  EnableConfirmNotificationsToChannel: boolean
  TeammateNameDisplay: string
  ExperimentalViewArchivedChannels: boolean
  ExperimentalEnableAutomaticReplies: boolean
  ExperimentalHideTownSquareinLHS: boolean
  ExperimentalTownSquareIsReadOnly: boolean
  LockTeammateNameDisplay: boolean
  ExperimentalPrimaryTeam: string
  ExperimentalDefaultChannels: string[]
}

export type PasswordSettings = {
  MinimumLength: number
  Lowercase: boolean
  Number: boolean
  Uppercase: boolean
  Symbol: boolean
}

export type SqlSettings = {
  DriverName: string
  DataSource: string
  DataSourceReplicas: string[]
  DataSourceSearchReplicas: string[]
  MaxIdleConns: number
  ConnMaxLifetimeMilliseconds: number
  MaxOpenConns: number
  Trace: boolean
  AtRestEncryptKey: string
  QueryTimeout: number
  DisableDatabaseSearch: boolean
}

export type LocalizationSettings = {
  DefaultServerLocale: string
  DefaultClientLocale: string
  AvailableLocales: string
}

export type PrivacySettings = {
  ShowEmailAddress: boolean
  ShowFullName: boolean
}

export type EmailSettings = {
  EnableSignUpWithEmail: boolean
  EnableSignInWithEmail: boolean
  EnableSignInWithUsername: boolean
  SendEmailNotifications: boolean
  UseChannelInEmailNotifications: boolean
  RequireEmailVerification: boolean
  FeedbackName: string
  FeedbackEmail: string
  ReplyToAddress: string
  FeedbackOrganization: string
  EnableSMTPAuth: boolean
  SMTPUsername: string
  SMTPPassword: string
  SMTPServer: string
  SMTPPort: string
  SMTPServerTimeout: number
  ConnectionSecurity: string
  SendPushNotifications: boolean
  PushNotificationServer: string
  PushNotificationContents: string
  EnableEmailBatching: boolean
  EmailBatchingBufferSize: number
  EmailBatchingInterval: number
  EnablePreviewModeBanner: boolean
  SkipServerCertificateVerification: boolean
  EmailNotificationContentsType: string
  LoginButtonColor: string
  LoginButtonBorderColor: string
  LoginButtonTextColor: string
}

export type GuestAccountsSettings = {
  Enable: boolean
  AllowEmailAccounts: boolean
  EnforceMultifactorAuthentication: boolean
  RestrictCreationToDomains: string
}

export type ExperimentalSettings = {
  ClientSideCertEnable: boolean
  ClientSideCertCheck: string
  EnableClickToReply: boolean
  LinkMetadataTimeoutMilliseconds: number
  RestrictSystemAdmin: boolean
  UseNewSAMLLibrary: boolean
  CloudBilling: boolean
}

export type SupportSettings = {
  TermsOfServiceLink: string
  PrivacyPolicyLink: string
  AboutLink: string
  HelpLink: string
  ReportAProblemLink: string
  SupportEmail: string
  CustomTermsOfServiceEnabled: boolean
  CustomTermsOfServiceReAcceptancePeriod: number
}

export type RateLimitSettings = {
  Enable: boolean
  PerSec: number
  MaxBurst: number
  MemoryStoreSize: number
  VaryByRemoteAddr: boolean
  VaryByUser: boolean
  VaryByHeader: string
}

export type AdminConfig = {
  ServiceSettings: Partial<ServiceSettings>
  TeamSettings: Partial<TeamSettings>
  PasswordSettings: Partial<PasswordSettings>
  LocalizationSettings: Partial<LocalizationSettings>
  SqlSettings: Partial<SqlSettings>
  PrivacySettings: Partial<PrivacySettings>
  EmailSettings: Partial<EmailSettings>
  GuestAccountsSettings: Partial<GuestAccountsSettings>
  ExperimentalSettings: Partial<ExperimentalSettings>
  SupportSettings: Partial<SupportSettings>
  RateLimitSettings: Partial<RateLimitSettings>
}

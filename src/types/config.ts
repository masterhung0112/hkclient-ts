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

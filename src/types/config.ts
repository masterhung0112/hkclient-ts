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
}

export type ClientLicense = Record<string, string>
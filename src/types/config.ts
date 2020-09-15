export type ClientConfig = {
    SiteURL: string
    DiagnosticId: string
    DefaultClientLocale: string
    TeammateNameDisplay: string
    LockTeammateNameDisplay: string
    NoAccounts: string
}

export type ClientLicense = Record<string, string>
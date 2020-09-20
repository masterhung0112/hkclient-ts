export type PreferenceType = {
    category: string;
    name: string;
    user_id: string;
    value?: string;
}

export type PreferencesType = {
    [x: string]: PreferenceType;
}
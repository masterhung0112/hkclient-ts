let localizeFunction: Function | null = null;
export function setLocalizeFunction(func: Function) {
    localizeFunction = func;
}

export function localizeMessage(id: string, defaultMessage: string): string {
    if (!localizeFunction) {
        return defaultMessage;
    }

    return localizeFunction(id, defaultMessage);
}

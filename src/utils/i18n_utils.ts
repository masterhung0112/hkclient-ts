type localizeFunction = (id: string, defaultMessage: string) => string

let localizeFunction: localizeFunction | null = null;

export function setLocalizeFunction(func: localizeFunction): void {
    localizeFunction = func;
}

export function localizeMessage(id: string, defaultMessage: string): string {
    if (!localizeFunction) {
        return defaultMessage;
    }

    return localizeFunction(id, defaultMessage);
}

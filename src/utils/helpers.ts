import { Dictionary } from "types/utilities";
import { General } from "hkconstants";
import { HkError } from "types/errors";
import { ClientConfig, PasswordConfig } from "types/config";

export function buildQueryString(parameters: Dictionary<any>): string {
  const keys = Object.keys(parameters);
  if (keys.length === 0) {
    return "";
  }

  let query = "?";
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    query += key + "=" + encodeURIComponent(parameters[key]);

    if (i < keys.length - 1) {
      query += "&";
    }
  }

  return query;
}

// Generates a RFC-4122 version 4 compliant globally unique identifier.
export function generateId(): string {
  // implementation taken from http://stackoverflow.com/a/2117523
  let id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  id = id.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    let v;

    if (c === "x") {
      v = r;
    } else {
      // eslint-disable-next-line no-mixed-operators
      v = (r & 0x3) | 0x8;
    }

    return v.toString(16);
  });
  return id;
}

// isMinimumServerVersion will return true if currentVersion is equal to higher or than the
// the provided minimum version. A non-equal major version will ignore minor and dot
// versions, and a non-equal minor version will ignore dot version.
// currentVersion is a string, e.g '4.6.0'
// minMajorVersion, minMinorVersion, minDotVersion are integers
export const isMinimumServerVersion = (
  currentVersion: string,
  minMajorVersion = 0,
  minMinorVersion = 0,
  minDotVersion = 0
): boolean => {
  if (!currentVersion || typeof currentVersion !== "string") {
    return false;
  }

  const split = currentVersion.split(".");

  const major = parseInt(split[0], 10);
  const minor = parseInt(split[1] || "0", 10);
  const dot = parseInt(split[2] || "0", 10);

  if (major > minMajorVersion) {
    return true;
  }
  if (major < minMajorVersion) {
    return false;
  }

  // Major version is equal, check minor
  if (minor > minMinorVersion) {
    return true;
  }
  if (minor < minMinorVersion) {
    return false;
  }

  // Minor version is equal, check dot
  if (dot > minDotVersion) {
    return true;
  }
  if (dot < minDotVersion) {
    return false;
  }

  // Dot version is equal
  return true;
};

export function isEmail(email: string): boolean {
  // writing a regex to match all valid email addresses is really, really hard. (see http://stackoverflow.com/a/201378)
  // this regex ensures:
  // - at least one character that is not a space, comma, or @ symbol
  // - followed by a single @ symbol
  // - followed by at least one character that is not a space, comma, or @ symbol
  // this prevents <Outlook Style> outlook.style@domain.com addresses and multiple comma-separated addresses from being accepted
  return /^[^ ,@]+@[^ ,@]+$/.test(email);
}

export function isValidUsername(name: string): string {
  let error = "";
  if (!name) {
    error = "This field is required";
  } else if (
    name.length < General.MIN_USERNAME_LENGTH ||
    name.length > General.MAX_USERNAME_LENGTH
  ) {
    error =
      "Must be between " +
      General.MIN_USERNAME_LENGTH +
      " and " +
      General.MAX_USERNAME_LENGTH +
      " characters";
  } else if (!/^[a-z0-9.\-_]+$/.test(name)) {
    error =
      "Username must contain only letters, numbers, and the symbols '.', '-', and '_'.";
  } else if (!/[a-z]/.test(name.charAt(0))) {
    //eslint-disable-line no-negated-condition
    error = "First character must be a letter.";
  } else {
    for (let i = 0; i < General.RESERVED_USERNAMES.length; i++) {
      if (name === General.RESERVED_USERNAMES[i]) {
        error = "Cannot use a reserved word as a username.";
        break;
      }
    }
  }

  return error;
}

export function isValidPassword(
  password: string,
  passwordConfig: PasswordConfig
): { valid: boolean; error: HkError | null } {
  let errorId = "user.settings.security.passwordError";

  let valid = true;
  const minimumLength =
    passwordConfig.minimumLength || General.MIN_PASSWORD_LENGTH;

  if (
    password.length < minimumLength ||
    password.length > General.MAX_PASSWORD_LENGTH
  ) {
    valid = false;
  }

  if (passwordConfig.requireLowercase) {
    if (!password.match(/[a-z]/)) {
      valid = false;
    }

    errorId += "Lowercase";
  }

  if (passwordConfig.requireUppercase) {
    if (!password.match(/[A-Z]/)) {
      valid = false;
    }

    errorId += "Uppercase";
  }

  if (passwordConfig.requireNumber) {
    if (!password.match(/[0-9]/)) {
      valid = false;
    }

    errorId += "Number";
  }

  if (passwordConfig.requireSymbol) {
    if (!password.match(/[ !"\\#$%&'()*+,-./:;<=>?@[\]^_`|~]/)) {
      valid = false;
    }

    errorId += "Symbol";
  }

  let hkError = null;

  if (!valid) {
    hkError = {
      intl: {
        id: errorId,
      },
    } as HkError;
    // error = (
    //     <FormattedMessage
    //         id={errorId}
    //         default='Your password must contain between {min} and {max} characters.'
    //         values={{
    //             min: minimumLength,
    //             max: Constants.MAX_PASSWORD_LENGTH,
    //         }}
    //     />
    // );
  }

  return { valid, error: hkError };
}

export function getPasswordConfig(config: Partial<ClientConfig>): PasswordConfig {
    return {
        minimumLength: parseInt(config.PasswordMinimumLength, 10),
        requireLowercase: config.PasswordRequireLowercase === 'true',
        requireUppercase: config.PasswordRequireUppercase === 'true',
        requireNumber: config.PasswordRequireNumber === 'true',
        requireSymbol: config.PasswordRequireSymbol === 'true',
    } as PasswordConfig
}
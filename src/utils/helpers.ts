import { Dictionary } from 'types/utilities'

export function buildQueryString(parameters: Dictionary<any>): string {
  const keys = Object.keys(parameters)
  if (keys.length === 0) {
    return ''
  }

  let query = '?'
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    query += key + '=' + encodeURIComponent(parameters[key])

    if (i < keys.length - 1) {
      query += '&'
    }
  }

  return query
}

// Generates a RFC-4122 version 4 compliant globally unique identifier.
export function generateId(): string {
  // implementation taken from http://stackoverflow.com/a/2117523
  let id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  id = id.replace(/[xy]/g, (c) => {
      const r = Math.floor(Math.random() * 16);
      let v;

      if (c === 'x') {
          v = r;
      } else {
          // eslint-disable-next-line no-mixed-operators
          v = r & 0x3 | 0x8;
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
export const isMinimumServerVersion = (currentVersion: string, minMajorVersion = 0, minMinorVersion = 0, minDotVersion = 0): boolean => {
  if (!currentVersion || typeof currentVersion !== 'string') {
      return false;
  }

  const split = currentVersion.split('.');

  const major = parseInt(split[0], 10);
  const minor = parseInt(split[1] || '0', 10);
  const dot = parseInt(split[2] || '0', 10);

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
}
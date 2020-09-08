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
export function getPreferenceKey(category: string, name: string): string {
  return `${category}--${name}`
}

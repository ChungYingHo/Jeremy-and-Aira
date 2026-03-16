/** Strips trailing slash, .html suffix, and ensures leading slash for consistent path comparison. */
export function normalizePath(path: string | undefined | null): string {
  if (!path || path === '/') return '/'
  let normalized = path.replace(/\/$/, '').replace(/\.html$/, '')
  if (!normalized.startsWith('/')) normalized = '/' + normalized
  return normalized
}

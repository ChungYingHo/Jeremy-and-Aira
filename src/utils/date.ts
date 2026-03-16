
/** January 1, 2025 */
export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** 2025.01.01 — used in article headers and changelogs */
export function formatDisplayDate(date: Date): string {
  if (isNaN(date.getTime())) return ''
  return date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')
}

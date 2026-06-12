/** 2025.01.01 — used in article headers and changelogs */
export function formatDisplayDate(date: Date): string {
  if (isNaN(date.getTime())) return ''
  return date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')
}

/** Parses the YYYYMMDD- filename prefix of a slug into a Date; null when absent. */
export function parseDateFromSlug(slug: string): Date | null {
  const filename = slug.split('/').pop() ?? ''
  const match = filename.match(/^(\d{4})(\d{2})(\d{2})-/)
  return match ? new Date(`${match[1]}-${match[2]}-${match[3]}`) : null
}

export type SortKeys = {
  time: number | null
  sameDateSort?: number
  title: string
}

/** Shared ordering for menu items and prev/next navigation: date, then sameDateSort, then title. */
export function compareSortKeys(a: SortKeys, b: SortKeys): number {
  if (a.time !== null && b.time !== null && a.time !== b.time) return a.time - b.time

  const sortDiff = (a.sameDateSort ?? 0) - (b.sameDateSort ?? 0)
  if (sortDiff !== 0) return sortDiff

  return a.title.localeCompare(b.title)
}

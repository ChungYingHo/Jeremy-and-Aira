const MAX_LENGTH = 150

// Derives a plain-text meta description from raw MDX body when frontmatter has no `description`.
// Strips import/export lines, admonition/JSX markers, and inline markdown tokens — best-effort, not a full parser.
export function getExcerpt(body: string): string {
  const text = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^import\s.+$/gm, '')
    .replace(/^export\s.+$/gm, '')
    .replace(/<[^>]+>/g, '')
    .replace(/^:::.*$/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Links whose text itself contains brackets dodge the rule above; drop the leftover target then stray brackets
    .replace(/\]\([^)]*\)/g, '')
    .replace(/[[\]]/g, '')
    .replace(/[*_>~|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length <= MAX_LENGTH) return text
  return `${text.slice(0, MAX_LENGTH).trimEnd()}…`
}

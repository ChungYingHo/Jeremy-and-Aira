import { defineCollection, z } from 'astro:content'

const commonSchema = z.object({
  title: z.string().optional().default('Untitled'),
  description: z.string().optional(),
  draft: z.boolean().optional().default(false),
  author: z.string().optional().default('Jeremy'),
  date: z.date().or(z.string()).optional(),
  tags: z.array(z.string()).optional().default([]),
  changelog: z.array(z.date().or(z.string())).optional().default([]),
  sameDateSort: z.number().optional().default(0),
})

const techbookCollection = defineCollection({
  type: 'content',
  schema: commonSchema,
})

const blogCollection = defineCollection({
  type: 'content',
  schema: commonSchema,
})

const releaseNotesCollection = defineCollection({
  type: 'content',
  schema: commonSchema,
})

export const collections = {
  'techbook': techbookCollection,
  'blog': blogCollection,
  'release-notes': releaseNotesCollection,
}

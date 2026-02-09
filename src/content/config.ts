import { defineCollection, z } from 'astro:content'

const commonSchema = z.object({
  title: z.string().optional().default('Untitled'),
  draft: z.boolean().optional().default(false),
  author: z.string().optional().default('Jeremy'),
  date: z.date().or(z.string()).optional(),
  tags: z.array(z.string()).optional().default([]),
  changelog: z.array(z.date().or(z.string())).optional().default([]),
})

const notesCollection = defineCollection({
  type: 'content',
  schema: commonSchema,
})

const seriesCollection = defineCollection({
  type: 'content',
  schema: commonSchema,
})

export const collections = {
  'notes': notesCollection,
  'series': seriesCollection,
}

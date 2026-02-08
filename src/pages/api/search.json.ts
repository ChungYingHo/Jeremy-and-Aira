import { buildSearchIndex } from '@/utils/searchIndexer'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  const posts = await buildSearchIndex()

  return new Response(JSON.stringify(posts), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=3600, s-maxage=3600' 
    }
  })
}

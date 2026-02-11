// @ts-check
import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import mdx from '@astrojs/mdx'
import remarkDirective from 'remark-directive'
import { visit } from 'unist-util-visit'
import pagefind from 'astro-pagefind'
import vercel from '@astrojs/vercel'

function remarkAdmonitions() {
  return (/** @type {any} */ tree) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        if (
          !['info', 'note', 'warning', 'danger', 'tip'].includes(node.name)
        ) return

        const data = node.data || (node.data = {})
        const tagName = node.type === 'textDirective' ? 'span' : 'div'

        data.hName = tagName
        data.hProperties = {
          class: `admonition ${node.name}`,
          ...node.attributes,
        }
      }
    })
  }
}

// https://astro.build/config
export default defineConfig({
  // 明確指定 static，確保 pagefind 搜尋功能正常運作
  output: 'static',

  integrations: [
    svelte(),
    mdx(),
    pagefind()
  ],

  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
    plugins: [tailwindcss()]
  },

  markdown: {
    shikiConfig: {
      theme: 'dracula',
      wrap: true,
    },
    remarkPlugins: [
      remarkDirective,
      remarkAdmonitions,
    ],
  },

  adapter: vercel({
    webAnalytics: { enabled: true }, // 開啟 Vercel 流量分析
    imageService: true, // 使用 Vercel 的圖片優化服務
  }),
});
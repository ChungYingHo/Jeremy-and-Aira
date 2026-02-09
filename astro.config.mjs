// @ts-check
import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import mdx from '@astrojs/mdx'
import remarkDirective from 'remark-directive'
import { visit } from 'unist-util-visit'

function remarkAdmonitions() {
  // 👇 修改這裡：加入 JSDoc 標註 tree 為 any，解決隱含 any 的報錯
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
  integrations: [svelte(), mdx()],

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
});
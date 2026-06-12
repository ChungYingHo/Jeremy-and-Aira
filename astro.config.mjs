// @ts-check
import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import mdx from '@astrojs/mdx'
import remarkDirective from 'remark-directive'
import { visit } from 'unist-util-visit'
import pagefind from 'astro-pagefind'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

function rehypeLazyImages() {
  return (/** @type {any} */ tree) => {
    let pastFirstImage = false
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return
      node.properties ??= {}
      // The first image may be the LCP element — leave it eager
      if (!pastFirstImage) {
        pastFirstImage = true
        return
      }
      node.properties.loading ??= 'lazy'
      node.properties.decoding ??= 'async'
    })
  }
}

function rehypeWrapTables() {
  return (/** @type {any} */ tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'table' || !parent || typeof index !== 'number') return
      const wrapper = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-wrapper'] },
        children: [node],
      }
      parent.children.splice(index, 1, wrapper)
    })
  }
}

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
  site: 'https://jeremyho.tw',

  // 明確指定 static，確保 pagefind 搜尋功能正常運作
  output: 'static',

  // Honor PORT from the environment so preview tooling can assign a free port
  server: { port: Number(process.env.PORT) || 4321 },

  integrations: [
    svelte(),
    mdx(),
    pagefind(),
    sitemap()
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
      theme: 'vitesse-light',
      wrap: true,
    },
    remarkPlugins: [
      remarkDirective,
      remarkAdmonitions,
      remarkMath,
    ],
    rehypePlugins: [
      rehypeKatex,
      rehypeWrapTables,
      rehypeLazyImages,
    ],
  },

  adapter: vercel({
    webAnalytics: { enabled: true },
    imageService: true,
  }),
})

import astro from 'eslint-plugin-astro'
import svelte from 'eslint-plugin-svelte'
import svelteParser from 'svelte-eslint-parser'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'

const sharedStyleRules = {
  quotes: ['error', 'single', { avoidEscape: true }],
  semi: ['error', 'never'],
  eqeqeq: ['error', 'always'],
  'no-var': 'error',
  'prefer-const': 'error',
}

export default [
  ...astro.configs.recommended,
  ...svelte.configs['flat/recommended'],

  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,mts,cts}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
    },
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'never'],
      indent: ['error', 2, { SwitchCase: 1 }],
      'eol-last': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],

      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-useless-return': 'warn',
      'no-else-return': 'warn',
      'no-unexpected-multiline': 'error',

      'no-console': ['warn', { allow: ['warn', 'error'] }],

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      'no-restricted-imports': [
        'error',
        {
          patterns: ['../*', './*'],
        },
      ],

      'import/no-relative-parent-imports': 'error',
      'import/no-relative-packages': 'error',

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'inline-type-imports',
        },
      ],
    },
  },

  {
    files: ['**/*.astro'],
    rules: {
      'no-console': 'off',
      ...sharedStyleRules,
    },
  },

  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
      },
    },
    rules: {
      ...sharedStyleRules,
      // Visualizer components iterate fixed-length arrays and rely on positional updates
      'svelte/require-each-key': 'off',
    },
  },
]

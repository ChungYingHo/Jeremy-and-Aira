import astro from "eslint-plugin-astro"
import tseslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"

export default [
  ...astro.configs.recommended,
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "eol-last": ["error", "always"],
      indent: [
        "error",
        2,
        {
          SwitchCase: 1,
        },
      ],
      semi: ["error", "never"],
      "no-multiple-empty-lines": [
        "error",
        {
          max: 1,
          maxEOF: 1,
        },
      ],
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
      eqeqeq: ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",
      "no-useless-return": "warn",
      "no-else-return": "warn",
      "no-unexpected-multiline": "error",
    },
  },
  {
    files: ["**/*.astro"],
    rules: {
      "no-console": "off",
    },
  },
]

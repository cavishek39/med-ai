import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: ['next'],
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      'no-unused-vars': 'off',
      'no-constant-condition': 'off',
      'no-explicit-any': 'off',
    },
    ignorePatterns: ['node_modules/', 'dist/'],
    plugins: ['@typescript-eslint'],
  }),
]

export default eslintConfig

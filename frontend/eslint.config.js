// @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import pluginRouter from '@tanstack/eslint-plugin-router'
import pluginQuery from '@tanstack/eslint-plugin-query'
import reactHooks from 'eslint-plugin-react-hooks'
import prettier from 'eslint-config-prettier'

export default [
  ...tanstackConfig,
  ...pluginRouter.configs['flat/recommended'],
  ...pluginQuery.configs['flat/recommended'],
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      // 公式テンプレート推奨の off 設定
      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',

      // React Hooks ルール
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    ignores: [
      'eslint.config.js',
      'prettier.config.js',
      'dist',
      'node_modules',
      '.next',
      'app',
      'legacy',
      'src/routeTree.gen.ts',
      'src/lib/types/generated/schema.ts',
    ],
  },
  prettier,
]

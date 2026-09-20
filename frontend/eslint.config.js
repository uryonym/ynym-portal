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
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      // 公式テンプレート推奨の off 設定
      'import/no-cycle': 'off',
      'sort-imports': 'off',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern: '{react,react-dom}',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin', 'type'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
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
      'src/routeTree.gen.ts',
      'src/lib/types/generated/schema.ts',
      'src/components/ui/**',
    ],
  },
  prettier,
]

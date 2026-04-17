import js from '@eslint/js'
import vitest from '@vitest/eslint-plugin'
import { defineConfig } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import ts from 'typescript-eslint'

export default defineConfig([
  // Ignore generated files
  {
    ignores: ['dist/**', 'node_modules/**'],
  },

  // Language rules
  js.configs.recommended,
  ts.configs.strictTypeChecked,
  ts.configs.stylisticTypeChecked,

  // TypeScript
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.js'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Import sorting
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Side effect imports
            ['^\\u0000'],

            // NodeJS built-ins
            ['^node:'],

            // External packages
            ['^@?\\w'],

            // Internal aliases
            ['^@spec/'],
            ['^@/'],

            // Relative imports
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)', '^\\.(?!/?$)', '^\\./?$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },

  // Vitest
  {
    files: ['**/*.spec.ts'],
    plugins: { vitest },
    rules: vitest.configs.recommended.rules,
    settings: {
      vitest: {
        typecheck: true,
      },
    },
  },

  // Must come after all configs as this turns off any rules that will conflict with prettier
  prettier,
])

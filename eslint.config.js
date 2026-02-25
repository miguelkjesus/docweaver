import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import jest from 'eslint-plugin-jest'
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

            // External packages
            ['^@?\\w'],

            // Internal aliases
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

  // Jest
  {
    files: ['**/*.spec.ts'],
    ...jest.configs['flat/style'],
    rules: {
      'jest/max-expects': ['error', { max: 1 }],
      'jest/no-unnecessary-assertion': 'error',
    },
  },

  // Must come after all configs as this turns off any rules that will conflict with prettier
  prettier,
])

// ESLint 9+ flat config. Replaces the old .eslintrc.js.
// Formatting rules live in Prettier now (see .prettierrc), so this file only
// carries correctness rules; eslint-config-prettier turns off anything that
// would fight the formatter.
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  {
    ignores: ['build/**', 'node_modules/**', 'coverage/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      // The repositories build UPDATE statements as uniform `push field; push
      // value; counter++` blocks. The final increment is dead today but keeps
      // the blocks copy-pasteable when a new column is added.
      'no-useless-assignment': 'off',
    },
  },
  {
    files: ['src/__test__/**/*.ts'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        jest: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        afterAll: 'readonly',
        afterEach: 'readonly',
      },
    },
  },
  prettier,
)

import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  testMatch: ['**/src/**/*.test.ts'],
  setupFiles: ['<rootDir>/src/test-setup.ts'],
  // ts-jest compiles our TS to CJS; it also downlevels Lit's ESM output so
  // `import 'lit'` works under this preset.
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: { module: 'commonjs', target: 'es2022' } }],
  },
  // Transform Lit's packages under both npm (node_modules/lit/) and pnpm
  // (node_modules/.pnpm/lit@x/node_modules/lit/) layouts.
  transformIgnorePatterns: ['/node_modules/(?!(\\.pnpm/)?(lit|@lit|lit-html|lit-element)[@/+])'],
}

export default config

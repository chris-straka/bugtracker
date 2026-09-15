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
  transformIgnorePatterns: ['/node_modules/(?!lit|@lit/|lit-html|lit-element/)'],
}

export default config

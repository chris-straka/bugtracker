import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  // The project compiles to CommonJS (`module: NodeNext` with no `"type": "module"`
  // in package.json), so this uses the CJS preset.
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Only our TypeScript goes through ts-jest. ESM-only dependencies such as
  // @faker-js/faker stay untransformed because Node 24.9+ lets jest require() ESM
  // directly. Transformed CJS fails in the ESM loader with `exports is not defined`.
  // This is why the suite needs Node 24.9 or newer.
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { allowJs: true } }],
  },
  transformIgnorePatterns: ['/node_modules/'],
  globalSetup: './src/__test__/_setup/globalSetup.ts',
  globalTeardown: './src/__test__/_setup/globalTeardown.ts',
}

export default jestConfig

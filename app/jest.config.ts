import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  // The project compiles to CommonJS (tsconfig `module: NodeNext` with no
  // `"type": "module"` in package.json), so the CJS preset is the matching one.
  preset: 'ts-jest',
  testEnvironment: 'node',
  // @faker-js/faker v10+ ships ESM only: route its .js through ts-jest
  // (allowJs) so it compiles to CJS like the rest of the suite.
  transform: {
    '^.+\\.m?[tj]sx?$': ['ts-jest', { tsconfig: { allowJs: true } }],
  },
  // pnpm nests packages under node_modules/.pnpm, so the ignore pattern
  // must key off that (a plain node_modules/ lookahead never matches).
  transformIgnorePatterns: ['\\.pnpm/(?!@faker-js\\+faker@)'],
  globalSetup: './src/__test__/_setup/globalSetup.ts',
  globalTeardown: './src/__test__/_setup/globalTeardown.ts',
}

export default jestConfig

import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  // The project compiles to CommonJS (tsconfig `module: NodeNext` with no
  // `"type": "module"` in package.json), so the CJS preset is the matching one.
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Only our TypeScript goes through ts-jest. ESM-only dependencies such as
  // @faker-js/faker must NOT be transformed to CJS: on Node 24.9+ jest
  // natively require()s ESM (see jest-runtime's requireEsm path), and feeding
  // transformed CJS into the ESM loader fails with `exports is not defined`.
  // Transforming faker was the old workaround for Node <24.9, which cannot
  // require() ESM — so this suite needs Node 24.9 or newer.
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { allowJs: true } }],
  },
  transformIgnorePatterns: ['/node_modules/'],
  globalSetup: './src/__test__/_setup/globalSetup.ts',
  globalTeardown: './src/__test__/_setup/globalTeardown.ts',
}

export default jestConfig

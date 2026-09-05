import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  // The project compiles to CommonJS (tsconfig `module: NodeNext` with no
  // `"type": "module"` in package.json), so the CJS preset is the matching one.
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './src/__test__/_setup/globalSetup.ts',
  globalTeardown: './src/__test__/_setup/globalTeardown.ts',
}

export default jestConfig

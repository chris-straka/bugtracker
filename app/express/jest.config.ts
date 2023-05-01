import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  globalSetup: './src/__test__/_setup/globalSetup.ts',
  globalTeardown: './src/__test__/_setup/globalTeardown.ts',
}

export default jestConfig

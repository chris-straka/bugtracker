import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  globalSetup: './src/config/__test__/_globalSetup.ts',
  globalTeardown: './src/config/__test__/_globalTeardown.ts',
  // transform: {
  //   '^.+\\.tsx?$': ['ts-jest',
  //     {
  //       tsconfig: 'tsconfig.json'
  //     },
  //   ],
  // }
}

export default jestConfig

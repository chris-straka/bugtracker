/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './src/__test__/_globalSetup.ts',
  globalTeardown: './src/__test__/_globalTeardown.ts',
}

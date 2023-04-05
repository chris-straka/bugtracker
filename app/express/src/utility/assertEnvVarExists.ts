export function assertEnvVarExists (name: string): void {
  const value = process.env[name]
  if (value === undefined || value === '') {
    throw new Error(`process.env.${name} is not set`)
  }
}
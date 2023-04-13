import { execSync } from 'child_process'

const globalTeardown = async () => {
  if (process.env.CI) {
    try {
      execSync('pnpm ddown')
    } catch (error) {
      console.error('Error when trying to stop docker containers:', error)
    }
  }
}

export default globalTeardown

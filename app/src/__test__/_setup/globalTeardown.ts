import { execSync } from 'child_process'
import { closeDbConnections } from '../helper/db'

const globalTeardown = async () => {
  if (process.env.JEST_STARTED_DOCKER === 'true') {
    try {
      execSync('pnpm ddown')
    } catch (error) {
      console.error('Error when trying to stop docker containers:', error)
    }
  }
  // No data cleanup here. globalSetup truncates before each run, and leaving the
  // rows lets you inspect the dev database afterwards.
  await closeDbConnections()
}

export default globalTeardown

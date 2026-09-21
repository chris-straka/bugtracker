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
  // No data cleanup here: globalSetup truncates before every run, so each run
  // is hermetic without a coin flip. Teardown runs in the main process after
  // workers exit; truncating here as well would only matter for humans
  // inspecting the dev DB afterwards, and it stays inspectable as-is.
  await closeDbConnections()
}

export default globalTeardown

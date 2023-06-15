import { execSync } from 'child_process'
import { closeDbConnections, cleanupDb } from '../helper/db'

const globalTeardown = async () => {
  if (process.env.CI) {
    try {
      execSync('pnpm ddown')
    } catch (error) {
      console.error('Error when trying to stop docker containers:', error)
    }
  } else { 
    if (Math.ceil(Math.random() * 10) === 10) {
      console.log('cleaning up test data in the PG DB')
      await cleanupDb()
    }
  }
  await closeDbConnections()
}

export default globalTeardown

import { execSync } from 'child_process'
import { cleanupDb } from '../../config/postgres'

const globalTeardown = async () => {
  if (process.env.CI) {
    try {
      execSync('pnpm ddown')
    } catch (error) {
      console.error('Error when trying to stop docker containers:', error)
    }
  } else { 
    if (Math.ceil(Math.random() * 10) === 10) {
      await cleanupDb()
    }
  }
}

export default globalTeardown

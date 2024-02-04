import dotenv from 'dotenv'
dotenv.config()
import { isPortReachable } from '../helper/db'
import { execSync } from 'child_process'

async function globalSetup() {
  const isDBReachable = await isPortReachable(5432)

  if (!isDBReachable) {
    execSync('pnpm dddev')

    let retries = 10
    let isReady = false

    while (!isReady && retries > 0) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // pg_isready comes with postgres
        execSync('docker exec postgres_container pg_isready')
        isReady = true
      } catch (error) {
        retries--
      }
    }
  } 

}

export default globalSetup
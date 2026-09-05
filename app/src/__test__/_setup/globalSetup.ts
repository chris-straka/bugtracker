import dotenv from 'dotenv'
dotenv.config()
import { isPortReachable } from '../helper/db'
import { execSync } from 'child_process'

async function globalSetup() {
  const isDBReachable = await isPortReachable(Number(process.env.PGPORT ?? 5432))

  if (!isDBReachable) {
    // Remember that we were the ones who started the containers, so teardown
    // only stops what it started. CI supplies its own Postgres/Redis.
    process.env.JEST_STARTED_DOCKER = 'true'
    execSync('pnpm dddev')

    let retries = 10
    let isReady = false

    while (!isReady && retries > 0) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // pg_isready comes with postgres
        execSync('docker exec postgres_container pg_isready')
        isReady = true
      } catch {
        retries--
      }
    }
  }
}

export default globalSetup

import dotenv from 'dotenv'
dotenv.config({ quiet: true })
import { cleanupDb, isPortReachable } from '../helper/db'
import { execSync } from 'child_process'

async function globalSetup() {
  const isDBReachable = await isPortReachable(Number(process.env.PGPORT ?? 5432))

  if (!isDBReachable) {
    // Teardown only stops containers this run started. CI supplies its own
    // Postgres and Redis.
    process.env.JEST_STARTED_DOCKER = 'true'
    execSync('pnpm dddev')

    let retries = 10
    let isReady = false

    while (!isReady && retries > 0) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        execSync('docker exec postgres_container pg_isready')
        // Wait for Redis too. Clients connect at module load and would otherwise
        // hit a container that is still starting.
        execSync('docker exec redis_container redis-cli ping')
        isReady = true
      } catch {
        retries--
      }
    }
  }

  // Start every run from empty tables. Parallel workers share one database, so
  // rows left by a previous run would be visible to every suite. Concurrent
  // `pnpm test` runs against the same database are not supported.
  await cleanupDb()
}

export default globalSetup

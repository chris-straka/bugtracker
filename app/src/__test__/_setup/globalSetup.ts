import dotenv from 'dotenv'
dotenv.config({ quiet: true })
import { cleanupDb, isPortReachable } from '../helper/db'
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
        // redis has no pg_isready equivalent; ping it the same way so
        // module-load-time clients never race a cold container
        execSync('docker exec redis_container redis-cli ping')
        isReady = true
      } catch {
        retries--
      }
    }
  }

  // Every run starts from empty tables. Suites share one database across
  // parallel workers, so leftover rows from a previous run are visible to
  // every suite — truncate deterministically instead of relying on the
  // teardown coin flip below ever firing. (Concurrent `pnpm test`
  // invocations against the same DB remain unsafe by design.)
  await cleanupDb()
}

export default globalSetup

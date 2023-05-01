import dotenv from 'dotenv'
dotenv.config()
import { isPortReachable } from '../helper'
import { execSync } from 'child_process'

async function globalSetup() {
  const isDBReachable = await isPortReachable(5432)

  console.log('\n\nDB already exists on port 5432?', isDBReachable)

  if (!isDBReachable) {
    console.log('Spinning up containers...')

    execSync('pnpm dddev')

    let retries = 10
    let isReady = false

    while (!isReady && retries > 0) {
      try {
        // wait one second each time before checking if the database is up
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // pg_isready is a command that's built into postgres
        execSync('docker exec postgres_container pg_isready')
        isReady = true
      } catch (error) {
        retries--
      }
    }

    console.log('Containers have spun up successfully\n')
  } else {
    console.log('running tests...\n')
  }
}

export default globalSetup
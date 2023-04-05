import dotenv from 'dotenv'
dotenv.config()
import { exec, execSync } from 'child_process'
import { isPortReachable } from '../utility/isPortReachable'

const globalSetup = async () => {
  const isDBReachable = await isPortReachable(5432)

  console.log('\n\nCan I reach port 5432?', isDBReachable)

  if (!isDBReachable) {
    console.log('Spinning up containers...\n')
    exec('pnpm ddev')

    let retries = 10
    let isReady = false

    while (!isReady && retries > 0) {
      try {
        // My database container is called postgres_container
        // pg_isready is a command that comes with postgres
        execSync('docker exec postgres_container pg_isready')
        isReady = true
      } catch (error) {
        retries--
        // wait one second each time
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
  }
}

export default globalSetup

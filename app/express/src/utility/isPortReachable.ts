import { Socket } from 'net'

export const isPortReachable = (port: number, host = 'localhost'): Promise<boolean> => {
  return new Promise((res) => {
    const socket = new Socket()

    const onError = () => {
      socket.destroy()
      res(false)
    }

    socket.setTimeout(1000)
    socket.once('error', onError)
    socket.once('timeout', onError)

    socket.connect(port, host, () => {
      socket.end()
      res(true)
    })
  })
}
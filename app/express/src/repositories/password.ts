import { db } from '../config/postgres'
import { redisClient } from '../config/redis'

async function changePassword(id: string, newPasswordHash: string) {
  try {
    const data = await db.query({
      name: 'change_password',
      text: 'UPDATE users SET password = $2 WHERE id = $1;',
      values: [id, newPasswordHash]
    })
    return data.rowCount > 0
  } catch (error) {
    console.error('error', error) 
  }
}

async function addToken(token: string, userId: string) {
  const TOKEN_EXPIRATION_IN_SECONDS = 3600 // 1 hour
  await redisClient.setEx(`reset-password:${token}`, TOKEN_EXPIRATION_IN_SECONDS, userId.toString())
}

async function grabUserFromToken(token: string) {
  const userId = await redisClient.get(`reset-password:${token}`)
  if (!userId) throw new Error('Invalid or expired token')

  // delete the used token
  await redisClient.del(`reset-password:${token}`) 
  return userId
}

export default { 
  changePassword,
  addToken,
  grabUserFromToken
}
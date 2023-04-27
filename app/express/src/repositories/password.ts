import { db } from '../config/postgres'
import { redisClient } from '../config/redis'

async function changePassword(id: string, newPasswordHash: string) {
  const data = await db.query({
    name: 'change_password',
    text: 'UPDATE user SET password = $2 WHERE id = $1;',
    values: [id, newPasswordHash]
  })
  return data.rowCount > 0
}

async function storeUserIdForPasswordReset(token: string, userId: string) {
  const TOKEN_EXPIRATION_IN_SECONDS = 3600 // 1 hour
  await redisClient.setEx(`reset-password:${token}`, TOKEN_EXPIRATION_IN_SECONDS, userId.toString())
}

async function getUserFromRedisUsingPasswordResetToken(token: string) {
  const userId = await redisClient.get(`reset-password:${token}`)

  // delete the used token
  await redisClient.del(`reset-password:${token}`) 
  return userId
}

export default { 
  changePassword,
  storeUserIdForPasswordReset,
  getUserFromRedisUsingPasswordResetToken
}
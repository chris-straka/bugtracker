import type { Secret, SignOptions } from "jsonwebtoken"
import jwt from "jsonwebtoken"

if (!process.env.JWT_SECRET) throw new Error('process.env.SECRET_KEY is not set');

const jwtConfig: SignOptions = {
  algorithm: 'HS256',
  expiresIn: '7d'
}

function sign(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET as Secret, jwtConfig)
}

function verify(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET as Secret, jwtConfig)
}

export default { sign, verify }
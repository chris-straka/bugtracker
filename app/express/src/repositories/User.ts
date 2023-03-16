import { User } from "../models/User";
import { db, dbType } from "../config/postgres";

interface IUserRepository {
  getUser: (email: string) => Promise<User>;
  createUser: (email: string, hashedPassword: string) => Promise<User>;
  deleteUser: (email: string) => Promise<boolean>
}

export class UserRepository implements IUserRepository {
  readonly #db: dbType

  constructor(db: dbType) {
    this.#db = db
  }

  async getUser(email: string) {
    const data = await this.#db.query({
      name: 'getuser',
      text: 'SELECT * FROM users WHERE email = $1;',
      values: [email],
    })
    return data.rows[0]
  }

  async createUser(email: string, hashedPassword: string) {
    const data = await this.#db.query({
      name: 'createuser',
      text: 'INSERT INTO users(email, password) VALUES ($1, $2) RETURNING *;',
      values: [email, hashedPassword],
    })
    return data.rows[0]
  }

  async deleteUser(email: string) {
    const result = await this.#db.query({
      name: 'deleteuser',
      text: 'DELETE FROM users WHERE email = $1;',
      values: [email]
    })
    return result.rowCount > 0
  }
}

export const userRepository = new UserRepository(db);

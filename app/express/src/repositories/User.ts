import { User } from "../models/Users/Vanilla";
import { postgres as db } from "../config/index";

export interface IUserDatabase {
  getUser: (email: string) => Promise<User>;
  createUser: (email: string, password: string) => Promise<User>;
}

export const postgres: IUserDatabase = {
  getUser(email) {
    return db
      .query({
        name: 'getUser',
        text: 'SELECT * FROM users WHERE email = $1;',
        values: [email],
      })
      .then((data: any) => data.rows[0]);
  },
  createUser(email, password) {
    return db
      .query({
        name: 'createUser',
        text: 'INSERT INTO users(email, password) VALUES ($1, $2) RETURNING *;',
        values: [email, password],
      })
      .then((data: any) => data.rows[0]);
  },
};


const UserDatabase = (db: IUserDatabase): IUserDatabase => ({
  getUser(email) {
    return db.getUser(email);
  },
  async createUser(email, password) {
    const hashedPassword = await Password.toHash(password);
    return db.createUser(email, hashedPassword);
  },
});

export const userDb = UserDatabase(postgres);
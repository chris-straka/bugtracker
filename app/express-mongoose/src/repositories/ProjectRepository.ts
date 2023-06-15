import { MongoClient } from 'mongodb'

export interface IProjectRepository {
  getProjects(): string[]
}

export function createProjectRepository(client: MongoClient): IProjectRepository {
  console.log(client)

  return {
    getProjects() {
      return ['a']
    }
  }
}
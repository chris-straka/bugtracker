export class Project {
  id: number; 
  owner_id: number;
  name: string;
  description: string;

  constructor(id: number, owner_id: number, name: string, description: string) {
    
  }
}

// CREATE TABLE Projects (
//   id SERIAL PRIMARY KEY,
//   owner_id INTEGER REFERENCES Users(id),
//   name VARCHAR(100) NOT NULL,
//   description VARCHAR(500) NOT NULL,
//   created_at TIMESTAMP NOT NULL DEFAULT NOW(),
//   last_modified_at TIMESTAMP NOT NULL DEFAULT NOW(),
// )
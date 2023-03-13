type UserRoles = "admin" | "project_manager" | "developer" | "contributor"

export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRoles;

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    role: UserRoles,
    last_modified_at: string
  ) {
    this.id = id
    this.name = name
    this.email = email
    this.password = password
    this.role = role
  }
}
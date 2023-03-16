export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "project_manager" | "developer" | "contributor";
}
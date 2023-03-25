import 'express-session'

declare module 'express-session' {
  interface SessionData {
    user?: Record<string, any> // You can add more properties to the user object if needed
  }
}

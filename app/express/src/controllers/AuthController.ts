import { Request, Response, NextFunction } from "express"
import sessions from "../config/session";

export function loginUser(req: Request, res: Response, next: NextFunction) {
  res.sendStatus(200)
}

export function logoutUser(req: Request, res: Response, next: NextFunction) { }
export function signupUser(req: Request, res: Response, next: NextFunction) { }
export function forgetPassword(req: Request, res: Response, next: NextFunction) { }
export function resetPassword(req: Request, res: Response, next: NextFunction) { }

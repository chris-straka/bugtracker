import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, _: Response, next: NextFunction) => {
  if (!req.session.user) next()
  else next('route')
};
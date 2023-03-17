import { Request, Response, NextFunction } from 'express';

export const sessionAuth = (req: Request, res: Response, next: NextFunction) => {
  const session = req.session as any

  if (!session) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  next();
};
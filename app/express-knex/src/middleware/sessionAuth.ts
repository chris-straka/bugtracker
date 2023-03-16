import { Request, Response, NextFunction } from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const session = req.session as any

  if (!session) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  next();
};

export default authMiddleware;
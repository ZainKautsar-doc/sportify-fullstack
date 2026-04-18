import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction): any => {
    const user = (req as any).user;

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden (admin only)' });
    }

    next();
};
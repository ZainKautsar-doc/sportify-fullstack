import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): any => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized (no token)' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized (invalid token format)' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ error: 'Unauthorized (token invalid)' });
    }

    // inject user ke request
    (req as any).user = decoded;
    console.log('[AuthMiddleware] req.user:', (req as any).user);

    next();
};
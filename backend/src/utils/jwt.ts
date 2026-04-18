import jwt from 'jsonwebtoken';

const SECRET = 'secret123';

export const generateToken = (payload: any) => {
    return jwt.sign(payload, SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET);
    } catch {
        return null;
    }
};
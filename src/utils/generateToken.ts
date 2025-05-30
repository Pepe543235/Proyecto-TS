import jwt from 'jsonwebtoken';
const ACCESS_SECRET = 'secret1234utd';

export const generateAccessToken = (userId: string) => {
 return jwt.sign(
        { userId }, 
        ACCESS_SECRET,
        { expiresIn: '15m' }
     );   
}

export const verifyAccessToken = (token: string): { userId: string } | null => {
    try {
        const decoded = jwt.verify(token, ACCESS_SECRET) as { userId: string, iat: number, exp: number };
        return { userId: decoded.userId };
    } catch (error) {
        return null;
    }
};
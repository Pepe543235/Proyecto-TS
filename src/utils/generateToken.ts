import jwt from 'jsonwebtoken';

const ACCESS_SECRET = 'secret1234utd';

export const generateAccessToken = (userId: string, roles: string[]) => {
  return jwt.sign(
    { userId, roles },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  );
};

export const verifyAccessToken = (
  token: string
): { userId: string; roles: string[] } | null => {
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as {
      userId: string;
      roles: string[];
      iat: number;
      exp: number;
    };
    return { userId: decoded.userId, roles: decoded.roles };
  } catch (error) {
    return null;
  }
};

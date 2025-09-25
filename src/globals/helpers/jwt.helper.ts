import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

export function generateToken(user: User) {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: '1d'
    }
  );

  return accessToken;
}


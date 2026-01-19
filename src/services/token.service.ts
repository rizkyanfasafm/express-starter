import { prisma } from '@/db/prisma';
import { env } from '@/env';
import ms, { StringValue } from 'ms';

export class TokenService {
  static async saveRefreshToken(userId: number, token: string) {
    const expiresAt = new Date(Date.now() + ms(env.JWT_REFRESH_EXPIRES_IN as StringValue));
    return prisma.refreshToken.create({
      data: { userId, token, expiresAt },
    });
  }

  static async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({ where: { token } });
  }

  static async deleteRefreshToken(token: string) {
    return prisma.refreshToken.delete({ where: { token } }).catch(() => null);
  }

  static async deleteUserRefreshTokens(userId: number) {
    return prisma.refreshToken.deleteMany({ where: { userId } });
  }
}

import { Response } from 'express';
import { AuthService } from '@/services/auth.service';
import { badRequest, created, ok, unauthorized } from '@/utils/response';
import { toUserResource } from '@/resources/user.resource';
import { User } from '../../generated/prisma/client';
import { signAccessToken, signRefreshToken, TokenPayload, verifyRefreshToken } from '@/utils/jwt';
import { UserService } from '@/services/user.service';
import { TokenService } from '@/services/token.service';
import { AuthRequest } from '@/middlewares/auth';

export class AuthController {
  static async register(req: AuthRequest, res: Response) {
    const user = await AuthService.register(req.body);
    return created(res, toUserResource(user));
  }

  static async login(req: AuthRequest, res: Response) {
    const user: User | null = await AuthService.login(req.body);
    if (!user) {
      return badRequest(res, 'Invalid email or password');
    }

    const payload: TokenPayload = { id: user.id, email: user.email };
    const refreshToken = signRefreshToken(payload);
    await TokenService.saveRefreshToken(user.id, refreshToken);

    return ok(res, {
      user: toUserResource(user),
      accessToken: signAccessToken(payload),
      refreshToken,
    });
  }

  static async refresh(req: AuthRequest, res: Response) {
    const { refreshToken } = req.body;

    const stored = await TokenService.findRefreshToken(refreshToken);
    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await TokenService.deleteRefreshToken(refreshToken);
      return unauthorized(res, 'Invalid refresh token');
    }

    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await UserService.findUserById(decoded.id);
      if (!user) return unauthorized(res);

      await TokenService.deleteRefreshToken(refreshToken);

      const payload: TokenPayload = { id: user.id, email: user.email };
      const newRefreshToken = signRefreshToken(payload);
      await TokenService.saveRefreshToken(user.id, newRefreshToken);

      return ok(res, {
        accessToken: signAccessToken(payload),
        refreshToken: newRefreshToken,
      });
    } catch {
      return unauthorized(res, 'Invalid refresh token');
    }
  }

  static async logout(req: AuthRequest, res: Response) {
    const { refreshToken } = req.body;
    await TokenService.deleteRefreshToken(refreshToken);
    return ok(res, null, 'Logged out');
  }

  static async logoutAll(req: AuthRequest, res: Response) {
    await TokenService.deleteUserRefreshTokens(req.userId!);
    return ok(res, null, 'Logged out from all devices');
  }

  static async me(req: AuthRequest, res: Response) {
    const user = await UserService.findUserById(req.userId!);
    return ok(res, { user: user ? toUserResource(user) : null });
  }
}

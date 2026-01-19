import { Request, Response } from 'express';
import { AuthService } from '@/services/auth.service';
import { badRequest, created, ok, unauthorized } from '@/utils/response';
import { toUserResource } from '@/resources/user.resource';
import { User } from '../../generated/prisma/client';
import { signAccessToken, signRefreshToken, TokenPayload, verifyRefreshToken } from '@/utils/jwt';
import { UserService } from '@/services/user.service';

export class AuthController {
  static async register(req: Request, res: Response) {
    const user = await AuthService.register(req.body);
    return created(res, toUserResource(user));
  }

  static async login(req: Request, res: Response) {
    const user: User | null = await AuthService.login(req.body);
    if (!user) {
      return badRequest(res, 'Invalid email or password');
    }

    const payload: TokenPayload = { id: user.id, email: user.email };

    return ok(res, {
      user: toUserResource(user),
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    });
  }

  static async refresh(req: Request, res: Response) {
    try {
      const decoded = verifyRefreshToken(req.body.refreshToken);
      const user = await UserService.findUserById(decoded.id);
      if (!user) return unauthorized(res);

      const payload: TokenPayload = { id: user.id, email: user.email };

      return ok(res, {
        accessToken: signAccessToken(payload),
        refreshToken: signRefreshToken(payload),
      });
    } catch {
      return unauthorized(res, 'Invalid refresh token');
    }
  }
}

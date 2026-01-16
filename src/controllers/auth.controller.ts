import { Request, Response } from 'express';
import { AuthService } from '@/services/auth.service';
import {badRequest, created, ok} from '@/utils/response';
import {toUserResource} from "@/resources/user.resource";
import {User} from "../../generated/prisma/client";
import {signAccessToken, TokenPayload} from "@/utils/jwt";

export class AuthController {
  static async register(req: Request, res: Response) {
    const user = await AuthService.register(req.body);
    return created(res, toUserResource(user));
  }

  static async login(req: Request, res: Response) {
    const user: User | null = await AuthService.login(req.body);
    console.log(user);
    if(!user) {
      return badRequest(res, 'Invalid email or password');
    }

    const payload : TokenPayload = {
      id: user.id,
      email: user.email,
    }

    const accessToken = signAccessToken(payload);

    return ok(res, {
      user: toUserResource(user),
      accessToken,
    });
  }
}

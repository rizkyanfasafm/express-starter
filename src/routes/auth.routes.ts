import { Router } from 'express';
import { AuthController } from '@/controllers/auth.controller';
import { validate } from '@/middlewares/validate';
import { loginSchema, registerSchema } from '@/validations/auth.validation';
import { auth, AuthRequest } from '@/middlewares/auth';
import { ok } from '@/utils/response';
import { User } from '../../generated/prisma/client';
import { UserService } from '@/services/user.service';

export const authRoutes = Router();

authRoutes.post('/register', validate(registerSchema), AuthController.register);
authRoutes.post('/login', validate(loginSchema), AuthController.login);
authRoutes.get('/me', auth, async (req: AuthRequest, res) => {
  const user: User | null = await UserService.findUserById(req.userId!);
  ok(res, { user });
});

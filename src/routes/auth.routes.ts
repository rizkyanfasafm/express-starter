import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from '@/controllers/auth.controller';
import { validate } from '@/middlewares/validate';
import { loginSchema, registerSchema } from '@/validations/auth.validation';
import { auth, AuthRequest } from '@/middlewares/auth';
import { ok } from '@/utils/response';
import { User } from '../../generated/prisma/client';
import { UserService } from '@/services/user.service';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { success: false, message: 'Too many attempts, please try again later' },
});

export const authRoutes = Router();

authRoutes.post('/register', authLimiter, validate(registerSchema), AuthController.register);
authRoutes.post('/login', authLimiter, validate(loginSchema), AuthController.login);
authRoutes.get('/me', auth, async (req: AuthRequest, res) => {
  const user: User | null = await UserService.findUserById(req.userId!);
  ok(res, { user });
});

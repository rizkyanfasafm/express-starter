import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from '@/controllers/auth.controller';
import { validate } from '@/middlewares/validate';
import { loginSchema, logoutSchema, refreshSchema, registerSchema } from '@/validations/auth.validation';
import { auth } from '@/middlewares/auth';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { success: false, message: 'Too many attempts, please try again later' },
  skip: () => process.env.NODE_ENV === 'test',
});

export const authRoutes = Router();

authRoutes.post('/register', authLimiter, validate(registerSchema), AuthController.register);
authRoutes.post('/login', authLimiter, validate(loginSchema), AuthController.login);
authRoutes.post('/refresh', validate(refreshSchema), AuthController.refresh);
authRoutes.post('/logout', validate(logoutSchema), AuthController.logout);
authRoutes.post('/logout-all', auth, AuthController.logoutAll);
authRoutes.get('/me', auth, AuthController.me);

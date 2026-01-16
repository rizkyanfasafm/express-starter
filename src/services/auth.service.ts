import { prisma } from '@/db/prisma';
import {hashPassword, verifyPassword} from '@/utils/password';
import {LoginInput, RegisterInput} from '@/validations/auth.validation';
import { UserService } from '@/services/user.service';
import { BadRequest } from '@/errors/bad-request';
import {User} from "../../generated/prisma/client";

export class AuthService {
  static async register(input: RegisterInput): Promise<User> {
    const existing = await UserService.findUserByEmail(input.email);
    if (existing) {
      throw new BadRequest('Email already in use');
    }

    return prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: await hashPassword(input.password),
      },
    });
  }

  static async login(input: LoginInput): Promise<User | null> {
    const user = await UserService.findUserByEmail(input.email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await verifyPassword(input.password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}

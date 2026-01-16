import { User } from '../../generated/prisma/client';
import dayjs from '@/utils/dayjs';

export interface UserResource {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export function toUserResource(user: User): UserResource {
  return {
    id: Number(user.id),
    name: user.name,
    email: user.email,
    created_at: dayjs(user.createdAt).toDateTimeString(),
  };
}

export function toUserCollection(users: User[]): UserResource[] {
  return users.map(toUserResource);
}

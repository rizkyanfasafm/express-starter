import {User} from "../../generated/prisma/client";
import {prisma} from "@/db/prisma";

export class UserService {
  static async findUserById(id: number) : Promise<User | null> {
    return prisma.user.findUnique({
      where: { id }
    })
  }

  static async findUserByEmail(email: string) : Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    })
  }
}

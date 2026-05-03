import { prisma } from "./prisma.client";
import { CreateUserData, UserRepository } from "../../../domain/repositories/UserRepository";

export class PrismaUserRepository implements UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username }
    });
  }

  create(data: CreateUserData) {
    return prisma.user.create({
      data
    });
  }

  findById(id: string) {
  return prisma.user.findUnique({
    where: { id }
  });
}
}
import { prisma } from "./prisma.client";
import {
  CreateUserData,
  UserRepository,
  UpdateUserProfileData,
} from "../../../domain/repositories/UserRepository";

export class PrismaUserRepository implements UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  create(data: CreateUserData) {
    return prisma.user.create({
      data,
    });
  }

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  updateProfile(id: string, data: UpdateUserProfileData) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  findAll(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    return prisma.user.findMany({
      skip,
      take: pageSize,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        rank: true,
        wins: true,
        losses: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  countAll() {
    return prisma.user.count();
  }

  updateRole(id: string, role: string) {
    return prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });
  }
}

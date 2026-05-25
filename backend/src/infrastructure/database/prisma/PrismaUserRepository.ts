import { prisma } from "./prisma.client";
import { CreateUserData, UserRepository, UpdateUserProfileData, FindDiscoverablePilotsParams } from "../../../domain/repositories/UserRepository";

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

  findActiveVehicleByUserId(userId: string) {
    return prisma.vehicle.findFirst({
      where: {
        userId,
        active: true,
      },
    });
  }

  async findDiscoverablePilots(params: FindDiscoverablePilotsParams) {
    const skip = (params.page - 1) * params.limit;

    const where: any = {
      id: {
        not: params.userId,
      },
      rank: params.rank,
      vehicles: {
        some: {
          active: true,
          vehicleType: params.vehicleType,
        },
      },
    };

    if (params.locality) {
      where.locality = params.locality;
    }

    if (params.city) {
      where.city = params.city;
    }

    if (params.state) {
      where.state = params.state;
    }

    if (params.country) {
      where.country = params.country;
    }

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: params.limit,
        orderBy: {
          username: "asc",
        },
        select: {
          id: true,
          username: true,
          profilePhoto: true,
          locality: true,
          city: true,
          state: true,
          country: true,
          rank: true,
          wins: true,
          losses: true,
          consecutiveWins: true,
          vehicles: {
            where: {
              active: true,
            },
            select: {
              id: true,
              vehicleType: true,
              brand: true,
              model: true,
              year: true,
              color: true,
              photo: true,
              active: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    };

  }
}

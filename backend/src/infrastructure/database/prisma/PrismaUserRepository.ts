import { prisma } from "./prisma.client";
import {
  CreateUserData,
  UserRepository,
  UpdateUserProfileData,
  FindDiscoverablePilotsParams,
  AdminUserFilters,
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
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        estado: true,
        rank: true,
        wins: true,
        losses: true,
        consecutiveWins: true,
        profilePhoto: true,
        locality: true,
        city: true,
        state: true,
        country: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  updateProfile(id: string, data: UpdateUserProfileData) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        estado: true,
        rank: true,
        wins: true,
        losses: true,
        consecutiveWins: true,
        profilePhoto: true,
        locality: true,
        city: true,
        state: true,
        country: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findAll(page: number, pageSize: number, filters: AdminUserFilters = {}) {
    const skip = (page - 1) * pageSize;
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { username: { contains: filters.search } },
        { email: { contains: filters.search } },
      ];
    }

    if (filters.estado) {
      where.estado = filters.estado;
    }

    if (filters.role) {
      where.role = filters.role;
    }

    return prisma.user.findMany({
      where,
      skip,
      take: pageSize,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        estado: true,
        rank: true,
        wins: true,
        losses: true,
        consecutiveWins: true,
        profilePhoto: true,
        locality: true,
        city: true,
        state: true,
        country: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  countAll(filters: AdminUserFilters = {}) {
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { username: { contains: filters.search } },
        { email: { contains: filters.search } },
      ];
    }

    if (filters.estado) {
      where.estado = filters.estado;
    }

    if (filters.role) {
      where.role = filters.role;
    }

    return prisma.user.count({
      where,
    });
  }

  countByEstado(estado: string) {
    return prisma.user.count({
      where: { estado },
    });
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

  updateEstado(id: string, estado: string) {
    return prisma.user.update({
      where: { id },
      data: { estado },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        estado: true,
        rank: true,
        wins: true,
        losses: true,
        consecutiveWins: true,
        profilePhoto: true,
        locality: true,
        city: true,
        state: true,
        country: true,
        createdAt: true,
        updatedAt: true,
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

    const total = await prisma.user.count({ where });

    if (total === 0) {
      return {
        items: [],
        pagination: {
          page: params.page,
          limit: params.limit,
          total: 0,
          totalPages: 0,
        },
      };
    }

    const limit = params.limit;

    // Si el total es menor o igual al límite, devolvemos la lista completa siempre (evita duplicados en la misma página)
    if (total <= limit) {
      const items = await prisma.user.findMany({
        where,
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
      });

      return {
        items,
        pagination: {
          page: params.page,
          limit: params.limit,
          total,
          totalPages: 1,
        },
      };
    }

    // Si el total es mayor al límite, calculamos el índice circular
    const startIndex = ((params.page - 1) * limit) % total;

    let items: any[] = [];
    if (startIndex + limit <= total) {
      // Caso simple: la porción no se desborda al final
      items = await prisma.user.findMany({
        where,
        skip: startIndex,
        take: limit,
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
      });
    } else {
      // Caso circular: se desborda y debemos dar la vuelta al inicio
      const firstPartCount = total - startIndex;
      const secondPartCount = limit - firstPartCount;

      const [firstPart, secondPart] = await Promise.all([
        prisma.user.findMany({
          where,
          skip: startIndex,
          take: firstPartCount,
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
        prisma.user.findMany({
          where,
          skip: 0,
          take: secondPartCount,
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
      ]);

      items = [...firstPart, ...secondPart];
    }

    return {
      items,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

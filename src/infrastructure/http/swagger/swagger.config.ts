import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RatRace API",
      version: "1.0.0",
      description:
        "API REST para la gestión de pilotos, vehículos, retos, ranking, notificaciones y chat en tiempo real.",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Servidor local",
      },
    ],
    tags: [
      {
        name: "Health",
        description: "Estado general de la API",
      },
      {
        name: "Auth",
        description: "Autenticación y autorización",
      },
      {
        name: "Users",
        description: "Gestión de usuarios y perfiles",
      },
      {
        name: "Vehicles",
        description: "Gestión de vehículos",
      },
      {
        name: "Challenges",
        description: "Gestión de retos",
      },
      {
        name: "Notifications",
        description: "Gestión de notificaciones",
      },
      {
        name: "Admin",
        description: "Operaciones administrativas",
      },
      {
        name: "Chat",
        description: "Conversaciones y mensajes",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "string",
              example: "Mensaje del error",
            },
            statusCode: {
              type: "number",
              example: 400,
            },
          },
        },

        RegisterRequest: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: {
              type: "string",
              example: "pablo",
            },
            email: {
              type: "string",
              example: "pablo@gmail.com",
            },
            password: {
              type: "string",
              example: "pablo23",
            },
          },
        },

        RegisterResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  example: "47afb628-1e6e-49c5-bd0f-131dd97b1c5f",
                },
                username: {
                  type: "string",
                  example: "pablo",
                },
                email: {
                  type: "string",
                  example: "pablo@gmail.com",
                },
              },
            },
            message: {
              type: "string",
              example: "Usuario registrado exitosamente",
            },
          },
        },

        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              example: "pablo@gmail.com",
            },
            password: {
              type: "string",
              example: "pablo23",
            },
          },
        },
        UserProfileResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  example: "47afb628-1e6e-49c5-bd0f-131dd97b1c5f",
                },
                username: {
                  type: "string",
                  example: "pablo",
                },
                email: {
                  type: "string",
                  example: "pablo@gmail.com",
                },
                role: {
                  type: "string",
                  example: "PILOT",
                },
                rank: {
                  type: "string",
                  example: "D",
                },
                wins: {
                  type: "number",
                  example: 0,
                },
                losses: {
                  type: "number",
                  example: 0,
                },
                profilePhoto: {
                  type: "string",
                  nullable: true,
                  example: "https://images/pablo.jpg",
                },
                locality: {
                  type: "string",
                  nullable: true,
                  example: "Calatrava",
                },
                city: {
                  type: "string",
                  nullable: true,
                  example: "Medellin",
                },
                state: {
                  type: "string",
                  nullable: true,
                  example: "Antioquia",
                },
                country: {
                  type: "string",
                  nullable: true,
                  example: "Colombia",
                },
              },
            },
            message: {
              type: "string",
              example: "Perfil obtenido correctamente",
            },
          },
        },

        UpdateProfileRequest: {
          type: "object",
          properties: {
            username: {
              type: "string",
              example: "valentinoRossiElite",
            },
            profilePhoto: {
              type: "string",
              nullable: true,
              example: "https://images/rossi_new.jpg",
            },
            locality: {
              type: "string",
              nullable: true,
              example: "Laureles",
            },
            city: {
              type: "string",
              nullable: true,
              example: "Medellin",
            },
            state: {
              type: "string",
              nullable: true,
              example: "Antioquia",
            },
            country: {
              type: "string",
              nullable: true,
              example: "Colombia",
            },
          },
        },

        DiscoverPilotsResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "object",
              properties: {
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        example: "09dc5f09-5597-4ac6-8640-80fdd54b6bef",
                      },
                      username: {
                        type: "string",
                        example: "juan",
                      },
                      profilePhoto: {
                        type: "string",
                        nullable: true,
                        example: "https://images/juan.jpg",
                      },
                      locality: {
                        type: "string",
                        nullable: true,
                        example: "Calatrava",
                      },
                      city: {
                        type: "string",
                        nullable: true,
                        example: "Itagui",
                      },
                      state: {
                        type: "string",
                        nullable: true,
                        example: "Antioquia",
                      },
                      country: {
                        type: "string",
                        nullable: true,
                        example: "Colombia",
                      },
                      rank: {
                        type: "string",
                        example: "D",
                      },
                      wins: {
                        type: "number",
                        example: 1,
                      },
                      losses: {
                        type: "number",
                        example: 2,
                      },
                      consecutiveWins: {
                        type: "number",
                        example: 1,
                      },
                      vehicles: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: {
                              type: "string",
                              example: "56d7e17-fd64-453f-a8a3-c00566488bff",
                            },
                            vehicleType: {
                              type: "string",
                              example: "motorcycle",
                            },
                            brand: {
                              type: "string",
                              example: "Yamaha",
                            },
                            model: {
                              type: "string",
                              example: "YZF-R3",
                            },
                            year: {
                              type: "number",
                              example: 2022,
                            },
                            color: {
                              type: "string",
                              example: "Blue",
                            },
                            photo: {
                              type: "string",
                              nullable: true,
                              example: "https://images/yamaha_yzf-r3.jpg",
                            },
                            active: {
                              type: "boolean",
                              example: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
                pagination: {
                  type: "object",
                  properties: {
                    page: {
                      type: "number",
                      example: 1,
                    },
                    limit: {
                      type: "number",
                      example: 10,
                    },
                    total: {
                      type: "number",
                      example: 1,
                    },
                    totalPages: {
                      type: "number",
                      example: 1,
                    },
                  },
                },
              },
            },
            message: {
              type: "string",
              example: "Pilotos disponibles consultados correctamente",
            },
          },
        },
        VehicleResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  example: "b4559545-9907-4d3f-99f5-8d089b2749e9",
                },
                userId: {
                  type: "string",
                  example: "2cce91b9-9b69-477d-976e-f31358c88dc9",
                },
                vehicleType: {
                  type: "string",
                  example: "motorcycle",
                },
                brand: {
                  type: "string",
                  example: "Yamaha",
                },
                model: {
                  type: "string",
                  example: "YZF-R3",
                },
                year: {
                  type: "number",
                  example: 2022,
                },
                color: {
                  type: "string",
                  example: "Blue",
                },
                plate: {
                  type: "string",
                  nullable: true,
                  example: "MOTO300",
                },
                photo: {
                  type: "string",
                  nullable: true,
                  example: "https://images/yamaha_yzfr3.jpg",
                },
                modifications: {
                  type: "string",
                  nullable: true,
                  example: "Escape deportivo y llantas de alto agarre",
                },
                active: {
                  type: "boolean",
                  example: true,
                },
                createdAt: {
                  type: "string",
                  format: "date-time",
                  example: "2026-05-08T22:52:10.423Z",
                },
                updatedAt: {
                  type: "string",
                  format: "date-time",
                  example: "2026-05-08T23:01:37.625Z",
                },
              },
            },
            message: {
              type: "string",
              example: "Vehículo obtenido correctamente",
            },
          },
        },

        VehiclesListResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    example: "b4559545-9907-4d3f-99f5-8d089b2749e9",
                  },
                  userId: {
                    type: "string",
                    example: "2cce91b9-9b69-477d-976e-f31358c88dc9",
                  },
                  vehicleType: {
                    type: "string",
                    example: "motorcycle",
                  },
                  brand: {
                    type: "string",
                    example: "Yamaha",
                  },
                  model: {
                    type: "string",
                    example: "YZF-R3",
                  },
                  year: {
                    type: "number",
                    example: 2022,
                  },
                  color: {
                    type: "string",
                    example: "Blue",
                  },
                  plate: {
                    type: "string",
                    nullable: true,
                    example: "MOTO300",
                  },
                  photo: {
                    type: "string",
                    nullable: true,
                    example: "https://images/yamaha_yzfr3.jpg",
                  },
                  modifications: {
                    type: "string",
                    nullable: true,
                    example: "Escape deportivo y llantas de alto agarre",
                  },
                  active: {
                    type: "boolean",
                    example: true,
                  },
                  createdAt: {
                    type: "string",
                    format: "date-time",
                    example: "2026-05-08T22:52:10.423Z",
                  },
                  updatedAt: {
                    type: "string",
                    format: "date-time",
                    example: "2026-05-08T23:01:37.625Z",
                  },
                },
              },
            },
            message: {
              type: "string",
              example: "Vehículos obtenidos correctamente",
            },
          },
        },

        CreateVehicleRequest: {
          type: "object",
          required: ["vehicleType", "brand", "model", "year", "color"],
          properties: {
            vehicleType: {
              type: "string",
              example: "motorcycle",
            },
            brand: {
              type: "string",
              example: "Kawasaki",
            },
            model: {
              type: "string",
              example: "Ninja 400",
            },
            year: {
              type: "number",
              example: 2021,
            },
            color: {
              type: "string",
              example: "Green",
            },
            plate: {
              type: "string",
              nullable: true,
              example: "MOTO400",
            },
            photo: {
              type: "string",
              nullable: true,
              example: "https://images/kawasaki_ninja400.jpg",
            },
            modifications: {
              type: "string",
              nullable: true,
              example: "Escape Akrapovic y suspensión ajustada",
            },
            active: {
              type: "boolean",
              example: true,
            },
          },
        },

        UpdateVehicleRequest: {
          type: "object",
          properties: {
            vehicleType: {
              type: "string",
              example: "motorcycle",
            },
            brand: {
              type: "string",
              example: "Kawasaki",
            },
            model: {
              type: "string",
              example: "Ninja 400",
            },
            year: {
              type: "number",
              example: 2021,
            },
            color: {
              type: "string",
              example: "Green",
            },
            plate: {
              type: "string",
              nullable: true,
              example: "MOTO300",
            },
            photo: {
              type: "string",
              nullable: true,
              example: "https://images/kawasaki_ninja400.jpg",
            },
            modifications: {
              type: "string",
              nullable: true,
              example: "Escape Akrapovic y suspensión ajustada",
            },
          },
        },

        DeleteVehicleResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              nullable: true,
              example: null,
            },
            message: {
              type: "string",
              example: "Vehículo eliminado correctamente",
            },
          },
        },

        CreateChallengeRequest: {
          type: "object",
          required: [
            "challengedId",
            "raceType",
            "agreedLocation",
            "agreedDate",
          ],
          properties: {
            challengedId: {
              type: "string",
              example: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e",
            },
            raceType: {
              type: "string",
              example: "quarter_mile",
            },
            agreedLocation: {
              type: "string",
              example: "Autopista Norte",
            },
            agreedDate: {
              type: "string",
              format: "date-time",
              example: "2026-05-10T22:00:00.000Z",
            },
            notes: {
              type: "string",
              nullable: true,
              example: "Reto amistoso",
            },
          },
        },

        CompleteChallengeRequest: {
          type: "object",
          required: ["winnerId"],
          properties: {
            winnerId: {
              type: "string",
              example: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e",
            },
          },
        },

        ChallengeResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  example: "8061ee9d-0247-4b67-a052-56e3a20b5e49",
                },
                challengerId: {
                  type: "string",
                  example: "2cce91b9-9b69-477d-976e-f31358c88dc9",
                },
                challengedId: {
                  type: "string",
                  example: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e",
                },
                raceType: {
                  type: "string",
                  example: "quarter_mile",
                },
                challengerVehicleId: {
                  type: "string",
                  example: "b4559545-9907-4d3f-99f5-8d089b2749e9",
                },
                challengedVehicleId: {
                  type: "string",
                  example: "61a80583-1840-46e0-851b-1878b5d416a2",
                },
                status: {
                  type: "string",
                  example: "pending",
                },
                winnerId: {
                  type: "string",
                  nullable: true,
                  example: null,
                },
                agreedLocation: {
                  type: "string",
                  example: "Autopista Norte",
                },
                agreedDate: {
                  type: "string",
                  format: "date-time",
                  example: "2026-05-10T22:00:00.000Z",
                },
                notes: {
                  type: "string",
                  nullable: true,
                  example: "Reto amistoso",
                },
                createdAt: {
                  type: "string",
                  format: "date-time",
                  example: "2026-05-08T23:23:34.797Z",
                },
                updatedAt: {
                  type: "string",
                  format: "date-time",
                  example: "2026-05-08T23:23:34.797Z",
                },
              },
            },
            message: {
              type: "string",
              example: "Reto encontrado",
            },
          },
        },

        ChallengeDetailResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  example: "8061ee9d-0247-4b67-a052-56e3a20b5e49",
                },
                challengerId: {
                  type: "string",
                  example: "2cce91b9-9b69-477d-976e-f31358c88dc9",
                },
                challengerName: {
                  type: "string",
                  example: "sam",
                },
                challengedId: {
                  type: "string",
                  example: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e",
                },
                challengedName: {
                  type: "string",
                  example: "juan",
                },
                raceType: {
                  type: "string",
                  example: "quarter_mile",
                },
                challengerVehicleId: {
                  type: "string",
                  example: "b4559545-9907-4d3f-99f5-8d089b2749e9",
                },
                challengerVehicleName: {
                  type: "string",
                  example: "Kawasaki Ninja 400",
                },
                challengedVehicleId: {
                  type: "string",
                  example: "61a80583-1840-46e0-851b-1878b5d416a2",
                },
                challengedVehicleName: {
                  type: "string",
                  example: "Suzuki GSX250R",
                },
                status: {
                  type: "string",
                  example: "completed",
                },
                winnerId: {
                  type: "string",
                  nullable: true,
                  example: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e",
                },
                agreedLocation: {
                  type: "string",
                  example: "Autopista Norte",
                },
                agreedDate: {
                  type: "string",
                  format: "date-time",
                  example: "2026-05-10T22:00:00.000Z",
                },
                notes: {
                  type: "string",
                  nullable: true,
                  example: "Reto amistoso",
                },
                createdAt: {
                  type: "string",
                  format: "date-time",
                  example: "2026-05-08T23:23:34.797Z",
                },
                updatedAt: {
                  type: "string",
                  format: "date-time",
                  example: "2026-05-08T23:33:38.997Z",
                },
              },
            },
            message: {
              type: "string",
              example: "Reto encontrado",
            },
          },
        },

        ChallengesListResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    example: "8061ee9d-0247-4b67-a052-56e3a20b5e49",
                  },
                  challengerId: {
                    type: "string",
                    example: "2cce91b9-9b69-477d-976e-f31358c88dc9",
                  },
                  challengerName: {
                    type: "string",
                    example: "sam",
                  },
                  challengedId: {
                    type: "string",
                    example: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e",
                  },
                  challengedName: {
                    type: "string",
                    example: "juan",
                  },
                  raceType: {
                    type: "string",
                    example: "quarter_mile",
                  },
                  challengerVehicleId: {
                    type: "string",
                    example: "b4559545-9907-4d3f-99f5-8d089b2749e9",
                  },
                  challengerVehicleName: {
                    type: "string",
                    example: "Kawasaki Ninja 400",
                  },
                  challengedVehicleId: {
                    type: "string",
                    example: "61a80583-1840-46e0-851b-1878b5d416a2",
                  },
                  challengedVehicleName: {
                    type: "string",
                    example: "Suzuki GSX250R",
                  },
                  status: {
                    type: "string",
                    example: "completed",
                  },
                  winnerId: {
                    type: "string",
                    nullable: true,
                    example: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e",
                  },
                  agreedLocation: {
                    type: "string",
                    example: "Autopista Norte",
                  },
                  agreedDate: {
                    type: "string",
                    format: "date-time",
                    example: "2026-05-10T22:00:00.000Z",
                  },
                  notes: {
                    type: "string",
                    nullable: true,
                    example: "Reto amistoso",
                  },
                  createdAt: {
                    type: "string",
                    format: "date-time",
                    example: "2026-05-08T23:23:34.797Z",
                  },
                  updatedAt: {
                    type: "string",
                    format: "date-time",
                    example: "2026-05-08T23:33:38.997Z",
                  },
                },
              },
            },
            message: {
              type: "string",
              example: "Retos del usuario encontrados",
            },
          },
        },

        CompleteChallengeResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "object",
              properties: {
                challenge: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                      example: "8061ee9d-0247-4b67-a052-56e3a20b5e49",
                    },
                    challengerId: {
                      type: "string",
                      example: "2cce91b9-9b69-477d-976e-f31358c88dc9",
                    },
                    challengedId: {
                      type: "string",
                      example: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e",
                    },
                    raceType: {
                      type: "string",
                      example: "quarter_mile",
                    },
                    status: {
                      type: "string",
                      example: "completed",
                    },
                    winnerId: {
                      type: "string",
                      example: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e",
                    },
                    agreedLocation: {
                      type: "string",
                      example: "Autopista Norte",
                    },
                    agreedDate: {
                      type: "string",
                      format: "date-time",
                      example: "2026-05-10T22:00:00.000Z",
                    },
                    notes: {
                      type: "string",
                      example: "Reto amistoso",
                    },
                  },
                },
                ranking: {
                  type: "object",
                  properties: {
                    winner: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          example: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e",
                        },
                        previousRank: {
                          type: "string",
                          example: "D",
                        },
                        currentRank: {
                          type: "string",
                          example: "D",
                        },
                        rankedUp: {
                          type: "boolean",
                          example: false,
                        },
                        consecutiveWins: {
                          type: "number",
                          example: 1,
                        },
                      },
                    },
                    loser: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          example: "2cce91b9-9b69-477d-976e-f31358c88dc9",
                        },
                        rank: {
                          type: "string",
                          example: "D",
                        },
                        consecutiveWins: {
                          type: "number",
                          example: 0,
                        },
                      },
                    },
                  },
                },
              },
            },
            message: {
              type: "string",
              example: "Reto completado correctamente",
            },
          },
        },
      },
      NotificationResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          data: {
            type: "object",
            properties: {
              id: {
                type: "string",
                example: "4cdbea2-2746-4f5a-8940-6676158d5e29",
              },
              userId: {
                type: "string",
                example: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e",
              },
              type: {
                type: "string",
                example: "challenge_started",
              },
              message: {
                type: "string",
                example: "El reto está en curso",
              },
              read: {
                type: "boolean",
                example: true,
              },
              referenceId: {
                type: "string",
                nullable: true,
                example: "8061ee9d-0247-4b67-a052-56e3a20b5e49",
              },
              createdAt: {
                type: "string",
                format: "date-time",
                example: "2026-05-08T23:30:58.240Z",
              },
            },
          },
          message: {
            type: "string",
            example: "Notificación marcada como leída",
          },
        },
      },

      NotificationsListResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  example: "96ae8d73-5464-469a-a503-1d0913ae388a",
                },
                userId: {
                  type: "string",
                  example: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e",
                },
                type: {
                  type: "string",
                  example: "challenge_completed",
                },
                message: {
                  type: "string",
                  example: "Ya se registró el resultado del reto",
                },
                read: {
                  type: "boolean",
                  example: false,
                },
                referenceId: {
                  type: "string",
                  nullable: true,
                  example: "8061ee9d-0247-4b67-a052-56e3a20b5e49",
                },
                createdAt: {
                  type: "string",
                  format: "date-time",
                  example: "2026-05-08T23:33:39.117Z",
                },
              },
            },
          },
          message: {
            type: "string",
            example: "Notificaciones encontradas",
          },
        },
      },
      ChatConversationResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  example: "69fe78b8ac375e9c5e0b5762",
                },
                participants: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  example: [
                    "2cce91b9-9b69-477d-976e-f31358c88dc9",
                    "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e",
                  ],
                },
                lastMessage: {
                  type: "string",
                  example: "hola",
                },
                lastMessageAt: {
                  type: "string",
                  format: "date-time",
                  example: "2026-05-08T23:58:48.280Z",
                },
                createdAt: {
                  type: "string",
                  format: "date-time",
                  example: "2026-05-08T23:58:48.252Z",
                },
                updatedAt: {
                  type: "string",
                  format: "date-time",
                  example: "2026-05-08T23:58:48.281Z",
                },
              },
            },
          },
          message: {
            type: "string",
            example: "Conversaciones obtenidas correctamente",
          },
        },
      },

      ChatMessagesResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  example: "69fe78b8ac375e9c5e0b5763",
                },
                conversationId: {
                  type: "string",
                  example: "69fe78b8ac375e9c5e0b5762",
                },
                senderId: {
                  type: "string",
                  example: "2cce91b9-9b69-477d-976e-f31358c88dc9",
                },
                receiverId: {
                  type: "string",
                  example: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e",
                },
                content: {
                  type: "string",
                  example: "hola",
                },
                read: {
                  type: "boolean",
                  example: false,
                },
                createdAt: {
                  type: "string",
                  format: "date-time",
                  example: "2026-05-08T23:58:48.270Z",
                },
                updatedAt: {
                  type: "string",
                  format: "date-time",
                  example: "2026-05-08T23:58:48.270Z",
                },
              },
            },
          },
          message: {
            type: "string",
            example: "Mensajes consultados correctamente",
          },
        },
      },
    },
  },
  apis: ["./src/infrastructure/http/routes/*.ts"],
});

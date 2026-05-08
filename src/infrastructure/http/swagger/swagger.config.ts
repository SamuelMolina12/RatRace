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
            },
        },
    },
    apis: [
        "./src/infrastructure/http/routes/*.ts",
    ],
});
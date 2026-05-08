# 🐭 RatRace

# ELECTIVA2_RatRace_API_EquipoRata

## Nombre de la materia

Electiva II - Desarrollo

## Nombre del proyecto

Rat Race API

## Equipo

Equipo Rata

## Integrantes

- Samuel Molina Parra
- Juan Camilo Hernandez
- Juan Parra Correa

## Descripción

Rat Race es una API REST desarrollada para gestionar carreras callejeras competitivas entre usuarios.
La plataforma permite registrar pilotos, administrar vehículos, crear retos entre usuarios compatibles, actualizar resultados de carreras, manejar ranking automático, generar notificaciones y utilizar comunicación en tiempo real mediante WebSockets.

El sistema está diseñado bajo arquitectura hexagonal para garantizar escalabilidad, mantenibilidad y separación de responsabilidades.

## Arquitectura

Se implementa arquitectura hexagonal, también conocida como Ports & Adapters.

- **Domain**: entidades, contratos de repositorios y reglas principales del negocio.
- **Application**: casos de uso de autenticación, usuarios, vehículos, retos, ranking, chat y notificaciones.
- **Infrastructure**: Express, rutas HTTP, controladores, Prisma, MongoDB, JWT, Socket.IO y servicios externos.
- **Shared**: errores personalizados, constantes y utilidades compartidas.

## Stack tecnológico

### Backend

- Node.js >= 20
- npm >= 10
- TypeScript
- Express.js
- Prisma ORM
- SQL Server
- MongoDB
- Socket.IO
- JWT
- bcrypt
- Zod
- Swagger / OpenAPI

### Librerías principales

- `express`: framework HTTP para construir la API REST.
- `typescript`: tipado estático del proyecto.
- `tsx`: ejecución del servidor en modo desarrollo.
- `prisma`: ORM usado para manejar la base de datos SQL Server.
- `@prisma/client`: cliente generado por Prisma.
- `@prisma/adapter-mssql`: adaptador usado por Prisma para SQL Server.
- `mssql`: driver de conexión con SQL Server.
- `mongoose`: conexión y modelos para MongoDB.
- `socket.io`: comunicación en tiempo real.
- `jsonwebtoken`: generación y validación de tokens JWT.
- `bcrypt`: hash de contraseñas.
- `dotenv`: manejo de variables de entorno.
- `cors`: configuración de CORS.
- `helmet`: cabeceras de seguridad HTTP.
- `morgan`: logs de peticiones HTTP.
- `zod`: validación de datos de entrada.
- `swagger-jsdoc`: generación de documentación Swagger.
- `swagger-ui-express`: interfaz visual para consultar la documentación de la API.

## Versiones principales usadas

Según el archivo `package.json`, el proyecto usa principalmente:

- `@prisma/client`: ^7.8.0
- `prisma`: ^7.8.0
- `@prisma/adapter-mssql`: ^7.8.0
- `express`: ^5.2.1
- `typescript`: ^6.0.3
- `tsx`: ^4.21.0
- `socket.io`: ^4.8.3
- `mongoose`: ^9.6.1
- `bcrypt`: ^6.0.0
- `jsonwebtoken`: ^9.0.3
- `zod`: ^4.3.6
- `swagger-jsdoc`: ^6.2.8
- `swagger-ui-express`: ^5.0.1
- `mssql`: ^12.5.0
- `helmet`: ^8.1.0
- `cors`: ^2.8.6
- `dotenv`: ^17.4.2
- `morgan`: ^1.10.1

## Base de datos

El proyecto utiliza dos sistemas de persistencia.

### SQL Server

Se utiliza SQL Server como base de datos principal para la información estructurada del sistema:

- Usuarios.
- Vehículos.
- Retos.
- Notificaciones.
- Ranking y estadísticas.

Prisma ORM se encarga de gestionar la comunicación con SQL Server.

### MongoDB

Se utiliza MongoDB para el módulo de chat en tiempo real:

- Conversaciones.
- Mensajes.
- Historial de chat.

## Entidades principales

### User

Representa a los pilotos registrados en la plataforma.

Campos principales:

- `id`
- `username`
- `email`
- `passwordHash`
- `role`
- `rank`
- `wins`
- `losses`
- `consecutiveWins`
- `profilePhoto`
- `locality`
- `city`
- `state`
- `country`
- `createdAt`
- `updatedAt`

### Vehicle

Representa los vehículos registrados por cada usuario.

Campos principales:

- `id`
- `userId`
- `vehicleType`
- `brand`
- `model`
- `year`
- `color`
- `plate`
- `photo`
- `modifications`
- `active`
- `createdAt`
- `updatedAt`

### Challenge

Representa un reto de carrera entre dos pilotos.

Campos principales:

- `id`
- `challengerId`
- `challengedId`
- `raceType`
- `challengerVehicleId`
- `challengedVehicleId`
- `status`
- `winnerId`
- `agreedLocation`
- `agreedDate`
- `notes`
- `createdAt`
- `updatedAt`

### Notification

Representa las notificaciones generadas por eventos del sistema.

Campos principales:

- `id`
- `userId`
- `type`
- `message`
- `read`
- `referenceId`
- `createdAt`

## Funcionalidades implementadas

### Autenticación y autorización

- Registro de usuarios.
- Inicio de sesión.
- Generación de token JWT.
- Protección de rutas privadas mediante middleware de autenticación.
- Manejo de roles: piloto y administrador.
- Validación de datos de entrada en auth con Zod.

### Gestión de usuarios

- Consultar perfil propio.
- Consultar perfil público de otro usuario.
- Actualizar perfil propio.
- Información de ranking, victorias, derrotas y ubicación del piloto.
- Descubrimiento de pilotos disponibles para retar, según rango y vehículo activo compatible.

### Gestión de vehículos

- Crear vehículos.
- Consultar vehículos propios.
- Consultar vehículo por ID.
- Actualizar vehículos.
- Eliminar vehículos.
- Marcar un vehículo como activo.
- Validación para manejar el vehículo activo del usuario.

### Gestión de retos

- Crear retos entre pilotos.
- Consultar retos propios.
- Consultar retos de un usuario.
- Consultar reto por ID.
- Aceptar retos.
- Rechazar retos.
- Cancelar retos.
- Iniciar retos.
- Completar retos.
- Registrar ganador.
- Actualizar estadísticas de usuarios.
- Aplicar ranking automático según victorias consecutivas.

### Ranking automático

- Cada usuario inicia en rango D.
- Las victorias incrementan el contador de victorias consecutivas.
- Al alcanzar las victorias consecutivas necesarias, el usuario sube de rango.
- Al subir de rango, el contador se reinicia.
- Las derrotas afectan el contador según las reglas de negocio definidas.

### Notificaciones

- Consultar notificaciones propias.
- Marcar notificaciones como leídas.
- Generar notificaciones asociadas a retos, resultados y cambios importantes.

### Administración

- Listar usuarios.
- Cambiar rol de usuario.
- Listar retos.
- Resolver retos como administrador.
- Rutas protegidas por autenticación y rol administrador.

### Chat y tiempo real

- Comunicación en tiempo real con Socket.IO.
- Registro de usuarios conectados.
- Envío de mensajes entre usuarios.
- Historial de conversaciones y mensajes mediante MongoDB.
- Eventos de escritura.
- Eventos de conexión y desconexión.

## Documentación

- Documentación de API mediante Swagger / OpenAPI.
- Estructura preparada para documentar endpoints, bodies, parámetros y respuestas.
- Validación de requests en endpoints principales mediante Zod.
- También se puede complementar con colección de Postman para pruebas manuales.

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto.

Ejemplo:

```env
PORT=3000

DATABASE_URL=sqlserver://localhost:1433;database=RATRACE;user=ratrace_user;password=Password123!;encrypt=false;trustServerCertificate=true

JWT_SECRET=rat_race_secret
JWT_EXPIRES_IN=1d

MONGO_URI=mongodb://localhost:27017/ratrace_chat
```

> Importante: el archivo `.env` no debe subirse al repositorio, ya que contiene información sensible como credenciales de base de datos y secretos JWT.

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/SamuelMolina12/RatRace.git
```

### 2. Entrar al proyecto

```bash
cd RatRace
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar variables de entorno

Crear el archivo `.env` en la raíz del proyecto con las variables necesarias para SQL Server, MongoDB, JWT y el puerto del servidor.

### 5. Crear base de datos SQL Server

Crear una base de datos llamada `RATRACE` en SQL Server.

Ejemplo:

```sql
CREATE DATABASE RATRACE;
```

Crear usuario de conexión si se desea usar un login específico:

```sql
CREATE LOGIN ratrace_user WITH PASSWORD = 'Password123!';
GO

USE RATRACE;
GO

CREATE USER ratrace_user FOR LOGIN ratrace_user;
GO

ALTER ROLE db_owner ADD MEMBER ratrace_user;
GO
```

### 6. Ejecutar migraciones de Prisma

```bash
npx prisma migrate dev
```

O usando el script del proyecto:

```bash
npm run prisma:migrate
```

### 7. Generar Prisma Client

```bash
npx prisma generate
```

### 8. Ejecutar MongoDB

Asegurarse de tener MongoDB instalado y corriendo localmente, o configurar `MONGO_URI` hacia una instancia válida.

Ejemplo local:

```txt
mongodb://localhost:27017/ratrace_chat
```

### 9. Ejecutar el servidor en desarrollo

```bash
npm run dev
```

El servidor debería iniciar en:

```txt
http://localhost:3000
```

## Scripts disponibles

### Ejecutar servidor en desarrollo

```bash
npm run dev
```

### Ejecutar migraciones de Prisma

```bash
npm run prisma:migrate
```

Ejecuta las migraciones configuradas con Prisma.

## Estructura general del proyecto

```txt
src
├── application
│   └── use-cases
├── config
├── domain
│   └── repositories
├── infrastructure
│   ├── database
│   │   ├── mongo
│   │   └── prisma
│   ├── http
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── routes
│   │   └── validators
│   ├── security
│   └── websocket
└── shared
    ├── constants
    └── errors
```

## Seguridad

- Las contraseñas se almacenan hasheadas con bcrypt.
- Las rutas protegidas requieren JWT.
- Las rutas administrativas requieren rol administrador.
- Las variables sensibles se manejan mediante `.env`.
- Se usa Helmet para mejorar cabeceras de seguridad HTTP.
- Se usa CORS para permitir el consumo controlado de la API.
- Se usa Zod para validar entradas en endpoints principales.
- El usuario autenticado se obtiene desde el token JWT, evitando enviar identificadores sensibles desde el body.


## Reglas de negocio principales

- Todo usuario nuevo inicia como piloto.
- Todo usuario nuevo inicia en rango D.
- El email y el username deben ser únicos.
- Un usuario puede registrar vehículos en su perfil.
- Solo un vehículo puede estar activo para competir.
- Un usuario necesita un vehículo activo para participar en retos.
- Un piloto solo puede retar a otro piloto compatible según las reglas del negocio.
- Los retos tienen un ciclo de vida definido.
- Al completar un reto, se actualizan estadísticas del ganador y del perdedor.
- El ranking se actualiza automáticamente según las victorias consecutivas.
- Las notificaciones se generan cuando ocurren eventos importantes dentro del sistema.


## Estado actual del proyecto

El backend cuenta con módulos principales:

- Autenticación.
- Usuarios.
- Vehículos.
- Retos.
- Ranking.
- Notificaciones.
- Administración.
- Chat en tiempo real.
- Persistencia en SQL Server y MongoDB.
- Validación de requests.
- Documentación de API.


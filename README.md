# 🐭 RatRace

# ELECTIVA2_RatRace_API_EquipoRata

##  Nombre de la materia
Electiva II - Desarrollo

##  Nombre del proyecto
Rat Race API

##  Equipo
Equipo Rata

##  Integrantes
- Samuel Molina Parra
- Juan Camilo Hernandez
- Juan Parra Correa

##  Descripción
Rat Race es una API REST desarrollada para gestionar carreras callejeras competitivas entre usuarios. 
Permite el registro de usuarios, gestión de vehículos, creación de retos y notificaciones en tiempo real.

El sistema está diseñado bajo arquitectura hexagonal para garantizar escalabilidad, mantenibilidad y separación de responsabilidades.

##  Arquitectura
Se implementa arquitectura hexagonal (Ports & Adapters):

- **Domain** → Entidades y lógica de negocio
- **Application** → Casos de uso
- **Infrastructure** → Express, base de datos, JWT
- **Shared** → Manejo de errores

##  Requerimientos

- Node.js >= 18
- npm >= 9
- TypeScript
- Express
-  PostgreSQL / MongoDB

## Instalación y ejecución


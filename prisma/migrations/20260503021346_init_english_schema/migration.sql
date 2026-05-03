/*
  Warnings:

  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `derrotas` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `foto_perfil` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `rango` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `victorias` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `zona_ciudad` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `zona_estado` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `zona_localidad` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `zona_pais` on the `users` table. All the data in the column will be lost.
  - Added the required column `passwordHash` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[users] DROP COLUMN [created_at],
[derrotas],
[foto_perfil],
[password_hash],
[rango],
[updated_at],
[victorias],
[zona_ciudad],
[zona_estado],
[zona_localidad],
[zona_pais];
ALTER TABLE [dbo].[users] ADD [city] NVARCHAR(1000),
[country] NVARCHAR(1000),
[createdAt] DATETIME2 NOT NULL CONSTRAINT [users_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[locality] NVARCHAR(1000),
[losses] INT NOT NULL CONSTRAINT [users_losses_df] DEFAULT 0,
[passwordHash] NVARCHAR(1000) NOT NULL,
[profilePhoto] NVARCHAR(1000),
[rank] NVARCHAR(1000) NOT NULL CONSTRAINT [users_rank_df] DEFAULT 'D',
[state] NVARCHAR(1000),
[updatedAt] DATETIME2 NOT NULL,
[wins] INT NOT NULL CONSTRAINT [users_wins_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

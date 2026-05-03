/*
  Warnings:

  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[users] ADD [derrotas] INT NOT NULL CONSTRAINT [users_derrotas_df] DEFAULT 0,
[foto_perfil] NVARCHAR(1000),
[rango] NVARCHAR(1000) NOT NULL CONSTRAINT [users_rango_df] DEFAULT 'D',
[updated_at] DATETIME2 NOT NULL,
[victorias] INT NOT NULL CONSTRAINT [users_victorias_df] DEFAULT 0,
[zona_ciudad] NVARCHAR(1000),
[zona_estado] NVARCHAR(1000),
[zona_localidad] NVARCHAR(1000),
[zona_pais] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

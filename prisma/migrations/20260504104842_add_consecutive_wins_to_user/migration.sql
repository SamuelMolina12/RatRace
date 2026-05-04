BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] NVARCHAR(1000) NOT NULL,
    [username] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [passwordHash] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL CONSTRAINT [users_role_df] DEFAULT 'PILOT',
    [rank] NVARCHAR(1000) NOT NULL CONSTRAINT [users_rank_df] DEFAULT 'D',
    [wins] INT NOT NULL CONSTRAINT [users_wins_df] DEFAULT 0,
    [losses] INT NOT NULL CONSTRAINT [users_losses_df] DEFAULT 0,
    [consecutiveWins] INT NOT NULL CONSTRAINT [users_consecutiveWins_df] DEFAULT 0,
    [profilePhoto] NVARCHAR(1000),
    [locality] NVARCHAR(1000),
    [city] NVARCHAR(1000),
    [state] NVARCHAR(1000),
    [country] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [users_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [users_username_key] UNIQUE NONCLUSTERED ([username]),
    CONSTRAINT [users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[vehicles] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [vehicleType] NVARCHAR(1000) NOT NULL,
    [brand] NVARCHAR(1000) NOT NULL,
    [model] NVARCHAR(1000) NOT NULL,
    [year] INT NOT NULL,
    [color] NVARCHAR(1000) NOT NULL,
    [plate] NVARCHAR(1000),
    [photo] NVARCHAR(1000),
    [modifications] NVARCHAR(1000),
    [active] BIT NOT NULL CONSTRAINT [vehicles_active_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [vehicles_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [vehicles_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [vehicles_plate_key] UNIQUE NONCLUSTERED ([plate])
);

-- CreateTable
CREATE TABLE [dbo].[challenges] (
    [id] NVARCHAR(1000) NOT NULL,
    [challengerId] NVARCHAR(1000) NOT NULL,
    [challengedId] NVARCHAR(1000) NOT NULL,
    [raceType] NVARCHAR(1000) NOT NULL,
    [challengerVehicleId] NVARCHAR(1000) NOT NULL,
    [challengedVehicleId] NVARCHAR(1000),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [challenges_status_df] DEFAULT 'pending',
    [winnerId] NVARCHAR(1000),
    [agreedLocation] NVARCHAR(1000),
    [agreedDate] DATETIME2,
    [notes] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [challenges_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [challenges_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [vehicles_userId_idx] ON [dbo].[vehicles]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [vehicles_userId_active_idx] ON [dbo].[vehicles]([userId], [active]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [challenges_challengerId_idx] ON [dbo].[challenges]([challengerId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [challenges_challengedId_idx] ON [dbo].[challenges]([challengedId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [challenges_status_idx] ON [dbo].[challenges]([status]);

-- AddForeignKey
ALTER TABLE [dbo].[vehicles] ADD CONSTRAINT [vehicles_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[challenges] ADD CONSTRAINT [challenges_challengerId_fkey] FOREIGN KEY ([challengerId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[challenges] ADD CONSTRAINT [challenges_challengedId_fkey] FOREIGN KEY ([challengedId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

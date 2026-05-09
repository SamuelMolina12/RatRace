BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[notifications] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [message] NVARCHAR(1000) NOT NULL,
    [read] BIT NOT NULL CONSTRAINT [notifications_read_df] DEFAULT 0,
    [referenceId] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [notifications_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [notifications_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [notifications_userId_idx] ON [dbo].[notifications]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [notifications_read_idx] ON [dbo].[notifications]([read]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [notifications_type_idx] ON [dbo].[notifications]([type]);

-- AddForeignKey
ALTER TABLE [dbo].[notifications] ADD CONSTRAINT [notifications_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

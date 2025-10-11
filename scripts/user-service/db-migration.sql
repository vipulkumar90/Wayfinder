IF OBJECT_ID(N'[__EFMigrationsHistory]', N'U') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
IF OBJECT_ID(N'[Users]', N'U') IS NULL
BEGIN
    CREATE TABLE [Users] (
        [Id] uniqueidentifier NOT NULL,
        [Username] nvarchar(100) NOT NULL,
        [Email] nvarchar(255) NOT NULL,
        [FirstName] nvarchar(100) NOT NULL,
        [LastName] nvarchar(100) NULL,
        [PhoneNumber] nvarchar(15) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NOT NULL,
        [IsActive] bit NOT NULL,
        CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Users_Email' AND object_id = OBJECT_ID(N'[Users]'))
    CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Users_PhoneNumber' AND object_id = OBJECT_ID(N'[Users]'))
    CREATE UNIQUE INDEX [IX_Users_PhoneNumber] ON [Users] ([PhoneNumber]) WHERE [PhoneNumber] IS NOT NULL;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Users_Username' AND object_id = OBJECT_ID(N'[Users]'))
    CREATE UNIQUE INDEX [IX_Users_Username] ON [Users] ([Username]);

MERGE [Users] AS target
USING (VALUES
    ('11111111-1111-1111-1111-111111111111', 'itadori', 'itadori.yuji@jjk.com', 'Yuji', 'Itadori', '1000000001', 1),
    ('22222222-2222-2222-2222-222222222222', 'fushiguro', 'megumi.fushiguro@jjk.com', 'Megumi', 'Fushiguro', '1000000002', 1),
    ('33333333-3333-3333-3333-333333333333', 'kugisaki', 'nobara.kugisaki@jjk.com', 'Nobara', 'Kugisaki', '1000000003', 0),
    ('44444444-4444-4444-4444-444444444444', 'gojo', 'satoru.gojo@jjk.com', 'Satoru', 'Gojo', '1000000004', 1),
    ('55555555-5555-5555-5555-555555555555', 'nanami', 'kento.nanami@jjk.com', 'Kento', 'Nanami', '1000000005', 0)
) AS source (Id, Username, Email, FirstName, LastName, PhoneNumber, IsActive)
ON target.Id = source.Id
WHEN NOT MATCHED THEN
    INSERT (Id, Username, Email, FirstName, LastName, PhoneNumber, CreatedAt, UpdatedAt, IsActive)
    VALUES (source.Id, source.Username, source.Email, source.FirstName, source.LastName, source.PhoneNumber, SYSUTCDATETIME(), SYSUTCDATETIME(), source.IsActive);

IF NOT EXISTS (
    SELECT 1 FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251006181824_InitialUser'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20251006181824_InitialUser', N'9.0.9');
END;

COMMIT;
GO

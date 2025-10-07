IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
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

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CreatedAt', N'Email', N'FirstName', N'IsActive', N'LastName', N'PhoneNumber', N'UpdatedAt', N'Username') AND [object_id] = OBJECT_ID(N'[Users]'))
    SET IDENTITY_INSERT [Users] ON;
INSERT INTO [Users] ([Id], [CreatedAt], [Email], [FirstName], [IsActive], [LastName], [PhoneNumber], [UpdatedAt], [Username])
VALUES ('11111111-1111-1111-1111-111111111111', '2025-09-27T00:00:00.0000000Z', N'itadori.yuji@jjk.com', N'Yuji', CAST(1 AS bit), N'Itadori', N'1000000001', '2025-09-27T00:00:00.0000000Z', N'itadori'),
('22222222-2222-2222-2222-222222222222', '2025-09-27T00:00:00.0000000Z', N'megumi.fushiguro@jjk.com', N'Megumi', CAST(1 AS bit), N'Fushiguro', N'1000000002', '2025-09-27T00:00:00.0000000Z', N'fushiguro'),
('33333333-3333-3333-3333-333333333333', '2025-09-27T00:00:00.0000000Z', N'nobara.kugisaki@jjk.com', N'Nobara', CAST(0 AS bit), N'Kugisaki', N'1000000003', '2025-09-27T00:00:00.0000000Z', N'kugisaki'),
('44444444-4444-4444-4444-444444444444', '2025-09-27T00:00:00.0000000Z', N'satoru.gojo@jjk.com', N'Satoru', CAST(1 AS bit), N'Gojo', N'1000000004', '2025-09-27T00:00:00.0000000Z', N'gojo'),
('55555555-5555-5555-5555-555555555555', '2025-09-27T00:00:00.0000000Z', N'kento.nanami@jjk.com', N'Kento', CAST(0 AS bit), N'Nanami', N'1000000005', '2025-09-27T00:00:00.0000000Z', N'nanami');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CreatedAt', N'Email', N'FirstName', N'IsActive', N'LastName', N'PhoneNumber', N'UpdatedAt', N'Username') AND [object_id] = OBJECT_ID(N'[Users]'))
    SET IDENTITY_INSERT [Users] OFF;

CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);

CREATE UNIQUE INDEX [IX_Users_PhoneNumber] ON [Users] ([PhoneNumber]) WHERE [PhoneNumber] IS NOT NULL;

CREATE UNIQUE INDEX [IX_Users_Username] ON [Users] ([Username]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251006181824_InitialUser', N'9.0.9');

COMMIT;
GO


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
IF OBJECT_ID(N'[AuthUsers]', N'U') IS NULL
BEGIN
    CREATE TABLE [AuthUsers] (
        [Id] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [PasswordHash] nvarchar(255) NOT NULL,
        [PasswordSalt] nvarchar(max) NOT NULL,
        [LastLoginAt] datetime2 NULL,
        [MustChangePassword] bit NOT NULL,
        [FailedLoginAttempts] int NOT NULL,
        [LockoutEnd] datetime2 NULL,
        [Roles] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_AuthUsers] PRIMARY KEY ([Id])
    );
END;

IF OBJECT_ID(N'[RefreshTokens]', N'U') IS NULL
BEGIN
    CREATE TABLE [RefreshTokens] (
        [Id] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [Token] nvarchar(max) NOT NULL,
        [ExpiresAt] datetime2 NOT NULL,
        [IsRevoked] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_RefreshTokens] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT 1 FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251006182206_InitialAuth'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20251006182206_InitialAuth', N'9.0.9');
END;

COMMIT;
GO

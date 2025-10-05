# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080



# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["services/user-service/src/Wayfinder.UserService/Wayfinder.UserService.Api/Wayfinder.UserService.Api.csproj", "services/user-service/src/Wayfinder.UserService/Wayfinder.UserService.Api/"]
COPY ["services/user-service/src/Wayfinder.UserService/Wayfinder.DataLayer/Wayfinder.DataLayer.csproj", "services/user-service/src/Wayfinder.UserService/Wayfinder.DataLayer/"]
RUN dotnet restore "services/user-service/src/Wayfinder.UserService/Wayfinder.UserService.Api/Wayfinder.UserService.Api.csproj"
COPY . .
WORKDIR "/src/services/user-service/src/Wayfinder.UserService/Wayfinder.UserService.Api"
RUN dotnet build "./Wayfinder.UserService.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build
WORKDIR "/src/services/user-service/src/Wayfinder.UserService"
# Add EF migration
RUN dotnet tool install --global dotnet-ef
RUN /root/.dotnet/tools/dotnet-ef migrations add InitialUser12 --context UserContext --startup-project ./Wayfinder.UserService.Api/Wayfinder.UserService.Api.csproj --project ./Wayfinder.DataLayer/Wayfinder.DataLayer.csproj

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
WORKDIR "/src/services/user-service/src/Wayfinder.UserService/Wayfinder.UserService.Api"
RUN dotnet publish "./Wayfinder.UserService.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Wayfinder.UserService.Api.dll"]

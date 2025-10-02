using Microsoft.EntityFrameworkCore;
using Wayfinder.DataLayer.DataContext;
using Wayfinder.UserService.Api.gRPC;
using Wayfinder.DataLayer.Repository;
using Microsoft.OpenApi.Models;
using Wayfinder.UserService.Api.MapperProfile;
using Wayfinder.DataLayer.Repository.Interface;
using Wayfinder.UserService.Api.Service;
using Wayfinder.UserService.Api.Service.Interface;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddGrpc()
    .AddJsonTranscoding();

builder.Services.AddGrpcSwagger();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1",
        new OpenApiInfo
        {
            Title = "Wayfinder User Service API",
            Version = "v1",
            Description = "API for managing users in the Wayfinder application.",
            Contact = new OpenApiContact
            {
                Name = "Wayfinder Support",
                Email = "support@wayfinder.com",
            }
        });
});

builder.Services.AddGrpcReflection();

builder.Services.AddDbContext<UserContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<GlobalProfile>();
    cfg.AddProfile<UserProfile>();
});

var app = builder.Build();
app.UseSwagger();
if (app.Environment.IsDevelopment())
{
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Wayfinder User Service API V1");
        c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
    });
    app.MapGrpcReflectionService();
}
// Configure the HTTP request pipeline.
app.MapGrpcService<UserApi>();
app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

app.Run();

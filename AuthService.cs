
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Shared.Common;

var builder = WebApplication.CreateBuilder(args);

// 1. Setup Cosmos DB
var cosmosClient = new CosmosClient(builder.Configuration["Cosmos:ConnectionString"]);
var db = await cosmosClient.CreateDatabaseIfNotExistsAsync("auth-db");
var authContainer = await db.Database.CreateContainerIfNotExistsAsync("users", "/userId");

builder.Services.AddSingleton(cosmosClient);
builder.Services.AddSingleton(authContainer.Container);

builder.Services.AddCors();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.UseSwagger();
app.UseSwaggerUI();

app.MapPost("/auth/register", async ([FromBody] RegisterRequest req, Container container) => {
    var userId = Guid.NewGuid().ToString();
    var newUser = new UserAccount(
        Id: userId, 
        UserId: userId, 
        Email: req.Email, 
        PasswordHash: BCrypt.Net.BCrypt.HashPassword(req.Password) 
    );
    await container.CreateItemAsync(newUser, new PartitionKey(newUser.UserId));
    return Results.Ok(new { newUser.UserId, newUser.Email });
});

app.MapPost("/auth/login", async ([FromBody] LoginRequest req, Container container, IConfiguration config) => {
    var query = new QueryDefinition("SELECT * FROM c WHERE c.email = @e").WithParameter("@e", req.Email);
    var iterator = container.GetItemQueryIterator<UserAccount>(query);
    var response = await iterator.ReadNextAsync();
    var dbUser = response.FirstOrDefault();

    if (dbUser == null || !BCrypt.Net.BCrypt.Verify(req.Password, dbUser.PasswordHash))
        return Results.Unauthorized();

    var token = JwtUtility.GenerateToken(dbUser.UserId, dbUser.Email, config["Jwt:Secret"]);
    return Results.Ok(new { token, userId = dbUser.UserId, email = dbUser.Email });
});

app.Run("http://localhost:5001");

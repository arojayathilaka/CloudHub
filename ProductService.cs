
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Shared.Common;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]))
        };
    });

var cosmosClient = new CosmosClient(builder.Configuration["Cosmos:ConnectionString"]);
var db = await cosmosClient.CreateDatabaseIfNotExistsAsync("product-db");
var productContainer = await db.Database.CreateContainerIfNotExistsAsync("products", "/categoryId");

builder.Services.AddSingleton(cosmosClient);
builder.Services.AddSingleton(productContainer.Container);

builder.Services.AddAuthorization();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/products", async (Container container) => {
    var query = new QueryDefinition("SELECT * FROM c");
    var iterator = container.GetItemQueryIterator<Product>(query);
    var results = new List<Product>();
    while (iterator.HasMoreResults) {
        var response = await iterator.ReadNextAsync();
        results.AddRange(response);
    }
    return Results.Ok(results);
}).RequireAuthorization();

app.MapPost("/products", async ([FromBody] ProductRequest req, Container container) => {
    var product = new Product(
        Id: Guid.NewGuid().ToString(),
        Name: req.Name,
        Description: req.Description,
        Price: req.Price,
        CategoryId: req.CategoryId,
        Stock: req.Stock
    );
    await container.CreateItemAsync(product, new PartitionKey(product.CategoryId));
    return Results.Created($"/products/{product.Id}", product);
}).RequireAuthorization();

app.MapPut("/products/{id}", async (string id, [FromBody] ProductRequest req, Container container) => {
    try {
        var updated = new Product(
            Id: id,
            Name: req.Name,
            Description: req.Description,
            Price: req.Price,
            CategoryId: req.CategoryId,
            Stock: req.Stock
        );
        await container.ReplaceItemAsync(updated, id, new PartitionKey(req.CategoryId));
        return Results.Ok(updated);
    } catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound) {
        return Results.NotFound();
    }
}).RequireAuthorization();

app.Run("http://localhost:5002");

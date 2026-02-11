
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Azure.Messaging.ServiceBus;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Shared.Common;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt => {
    opt.TokenValidationParameters = new TokenValidationParameters {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"])),
        ValidateIssuer = false, 
        ValidateAudience = false
    };
});

//var cosmosOptions = new CosmosClientOptions { PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase };
var cosmosOptions = new CosmosClientOptions {
    SerializerOptions = new CosmosSerializationOptions {
        PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase
    }
};
var cosmosClient = new CosmosClient(builder.Configuration["Cosmos:ConnectionString"], cosmosOptions);
//var cosmosClient = new CosmosClient(builder.Configuration["Cosmos:ConnectionString"]);
var db = await cosmosClient.CreateDatabaseIfNotExistsAsync("cloudhub-db");
var orderContainer = await db.Database.CreateContainerIfNotExistsAsync("orders", "/userId");

// Setup Service Bus with WebSockets (Port 443) to bypass local firewall/AMQP blocks
var sbOptions = new ServiceBusClientOptions
{
    TransportType = ServiceBusTransportType.AmqpWebSockets
};
var sbClient = new ServiceBusClient(builder.Configuration["ServiceBus:ConnectionString"], sbOptions);
//var sbClient = new ServiceBusClient(builder.Configuration["ServiceBus:ConnectionString"]);
var sender = sbClient.CreateSender("order-events");

builder.Services.AddSingleton(orderContainer.Container);
builder.Services.AddSingleton(sender);

builder.Services.AddAuthorization();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/orders", async ([FromBody] OrderRequest orderReq, Container container, ServiceBusSender sbSender, HttpContext context) => {
    var userId = context.User.FindFirst("userId")?.Value;
    if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();

    var order = new Order(
        Id: Guid.NewGuid().ToString(),
        OrderId: "ORD-" + Guid.NewGuid().ToString().Substring(0, 8),
        UserId: userId,
        Items: orderReq.Items.Select(i => new OrderItem(i.ProductId, i.ProductName, i.Quantity, i.Price)).ToList(),
        TotalAmount: orderReq.TotalAmount,
        CreatedAt: DateTime.UtcNow,
        Status: "Pending"
    );

    await container.CreateItemAsync(order, new PartitionKey(userId));

    // 2. Publish Event to Service Bus
    try
    {
        var eventData = new OrderCreatedEvent
        {
            OrderId = order.OrderId,
            UserId = userId,
            TotalAmount = order.TotalAmount
        };
        await sbSender.SendMessageAsync(new ServiceBusMessage(JsonSerializer.Serialize(eventData)));
    }
    catch (Exception ex)
    {
        return Results.Accepted($"/orders/user/{userId}", new
        {
            Message = "Order saved to DB, but notification system is currently unavailable.",
            Order = order,
            Warning = ex.Message
        });
    }

    return Results.Ok(order);
}).RequireAuthorization();

app.MapGet("/orders/user/{userId}", async (string userId, Container container) => {
    var query = new QueryDefinition("SELECT * FROM c WHERE c.userId = @u").WithParameter("@u", userId);
    var iterator = container.GetItemQueryIterator<Order>(query);
    var results = new List<Order>();
    while (iterator.HasMoreResults) {
        var response = await iterator.ReadNextAsync();
        results.AddRange(response);
    }
    return Results.Ok(results);
}).RequireAuthorization();

app.Run();

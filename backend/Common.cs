
using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json.Serialization;

namespace Shared.Common;

public static class JwtUtility
{
    public static string GenerateToken(string userId, string email, string secretKey)
    {
        var claims = new[] {
            new Claim(JwtRegisteredClaimNames.Sub, userId),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim("userId", userId),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "MicroservicesDemo",
            audience: "CloudHubClients",
            claims: claims,
            expires: DateTime.Now.AddHours(2),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

// --- Auth Models ---
public record RegisterRequest(string Email, string Password);
public record LoginRequest(string Email, string Password);
public record UserAccount(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("userId")] string UserId,
    [property: JsonPropertyName("email")] string Email,
    [property: JsonPropertyName("passwordHash")] string PasswordHash
);

// --- Product Models ---
public record ProductRequest(string Name, string Description, decimal Price, string CategoryId, int Stock);
public record Product(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("description")] string Description,
    [property: JsonPropertyName("price")] decimal Price,
    [property: JsonPropertyName("categoryId")] string CategoryId,
    [property: JsonPropertyName("stock")] int Stock
);

// --- Order Models ---
public record OrderItemRequest(string ProductId, string ProductName, int Quantity, decimal Price);
public record OrderRequest(List<OrderItemRequest> Items, decimal TotalAmount);

public record OrderItem(
    [property: JsonPropertyName("productId")] string ProductId,
    [property: JsonPropertyName("productName")] string ProductName,
    [property: JsonPropertyName("quantity")] int Quantity,
    [property: JsonPropertyName("price")] decimal Price
);

public record Order(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("orderId")] string OrderId,
    [property: JsonPropertyName("userId")] string UserId,
    [property: JsonPropertyName("items")] List<OrderItem> Items,
    [property: JsonPropertyName("totalAmount")] decimal TotalAmount,
    [property: JsonPropertyName("createdAt")] DateTime CreatedAt,
    [property: JsonPropertyName("status")] string? Status
);

// --- Messaging Models ---
public class OrderCreatedEvent
{
    public string EventType { get; set; } = "OrderCreated";
    public string? OrderId { get; set; }
    public string? UserId { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

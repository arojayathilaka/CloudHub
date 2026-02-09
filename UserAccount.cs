using Newtonsoft.Json;

public class UserAccount{

    [JsonProperty("id")]
    public string Id { get; set; } = null!;
    public string UserId { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string passwordHash { get; set; }
}




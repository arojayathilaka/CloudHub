using Azure.Messaging.ServiceBus;
using System.Text.Json;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly IConfiguration _config;

    private ServiceBusProcessor _processor;

    public Worker(ILogger<Worker> logger, IConfiguration config)
    {
        _logger = logger;
        _config = config;
    }

    public override async Task StartAsync(CancellationToken cancellationToken)
    {
        var connectionString = _config["ServiceBus:ConnectionString"];
        var topicName = _config["ServiceBus:TopicName"];
        var subscriptionName = _config["ServiceBus:SubscriptionName"];

        var client = new ServiceBusClient(connectionString);

        _processor = client.CreateProcessor(
            topicName,
            subscriptionName,
            new ServiceBusProcessorOptions()
        );

        _processor.ProcessMessageAsync += MessageHandler;
        _processor.ProcessErrorAsync += ErrorHandler;

        await _processor.StartProcessingAsync(cancellationToken);
    }

    private async Task MessageHandler(ProcessMessageEventArgs args)
    {
        var json = args.Message.Body.ToString();

        var orderEvent = JsonSerializer.Deserialize<OrderCreatedEvent>(json);

        _logger.LogInformation(
            $"Order {orderEvent.OrderId} created for user {orderEvent.UserId}"
        );

        await args.CompleteMessageAsync(args.Message);
    }

    private Task ErrorHandler(ProcessErrorEventArgs args)
    {
        _logger.LogError(args.Exception, "Service Bus Error");
        return Task.CompletedTask;
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        await _processor.StopProcessingAsync(cancellationToken);
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
        => Task.CompletedTask;
}

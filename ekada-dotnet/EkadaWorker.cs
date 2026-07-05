using System.ComponentModel;

public class EkadaWorker : BackgroundService
{
    private readonly ILogger<EkadaWorker> _logger;
    private readonly IServiceScopeFactory _scopeFactory;
    
    public EkadaWorker(ILogger<EkadaWorker> logger, IServiceScopeFactory scopeFactory)
    {
        _logger = logger;
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        var scope = _scopeFactory.CreateScope();
        var service = scope.ServiceProvider.GetRequiredService<EkadaSyncService>();
        await service.SyncAsync();
    }

}
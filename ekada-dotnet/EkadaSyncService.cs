using ekada_dotnet.db;
using Microsoft.EntityFrameworkCore;

public class EkadaSyncService
{

    private readonly EkadaContext _context;
    private static readonly HttpClient _client = new HttpClient();

    public EkadaSyncService(EkadaContext context)
    {
        _context = context;
    }

    public async Task SyncAsync()
    {
        try
        {
            using HttpResponseMessage response = await _client.GetAsync("");
        }
        catch (HttpRequestException hre)
        {
            
        }
    }
}
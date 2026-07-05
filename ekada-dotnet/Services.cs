using ekada_dotnet.db;
using ekada_dotnet.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace ekada_dotnet.Services;

public class DbQuery
{
    private readonly IMemoryCache _cache;
    private readonly EkadaContext _context;

    public DbQuery(IMemoryCache cache, EkadaContext context)
    {
        _cache = cache;
        _context = context;
    }

    public async Task<List<MatchSchedule>> GetMatches(string? league)
    {
        int year = DateTime.Now.Year;
        string key = $"match-schedule:{league}:{year}";
        string clause = $"{league}/{year} Season/%";
        return await _cache.GetOrCreateAsync(key, async entry =>
        {
            entry.SetAbsoluteExpiration(TimeSpan.FromMinutes(10));
            return await _context.MatchSchedule
                  .Where(m => EF.Functions.Like(m.OverviewPage, clause))
                  .ToListAsync();
        }) ?? new List<MatchSchedule>();
    }

    public async Task<List<Standings>> GetStandings(string? league)
    {
        string key = $"standings:{league}";
        return await _cache.GetOrCreateAsync(key, async entry =>
        {
            entry.SetAbsoluteExpiration(TimeSpan.FromMinutes(10));
            return await _context.Standings
                    .Where(e => EF.Functions.Like(e.LeagueName, league))
                    .ToListAsync();
        }) ?? new List<Standings>();
    }

    public async Task<List<MatchData>> GetMatchData(string? match, string? game)
    {
        string key = $"match-data:{match}:{game}";
        return await _cache.GetOrCreateAsync(key, async entry =>
        {
            entry.SetAbsoluteExpiration(TimeSpan.FromMinutes(10));
            return await _context.MatchData
                .Where(mid => EF.Functions.Like(mid.MatchId, match))
                .Where(gid => EF.Functions.Like(gid.GameId, game))
                .ToListAsync();
        }) ?? new List<MatchData>();
    }

    public async Task<List<Team>> GetTeam(string? team, string? tournament)
    {
        string key = $"team:{team}:{tournament}";
        return await _cache.GetOrCreateAsync(key, async entry =>
        {
            entry.SetAbsoluteExpiration(TimeSpan.FromMinutes(10));
            return await _context.Teams
                    .Where(t => EF.Functions.Like(t.TeamName, team))
                    .Where(tn => EF.Functions.Like(tn.Tournament, tournament))
                    .ToListAsync();
        }) ?? new List<Team>();
    }
}
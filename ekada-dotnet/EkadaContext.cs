using ekada_dotnet.Models;
using Microsoft.EntityFrameworkCore;

namespace ekada_dotnet.db;

public class EkadaContext : DbContext
{
    public EkadaContext(DbContextOptions<EkadaContext> options) : base(options) {}
    
    public DbSet<MatchData> MatchData => Set<MatchData>();
    public DbSet<MatchSchedule> MatchSchedule => Set<MatchSchedule>();
    public DbSet<Standings> Standings => Set<Standings>();
    public DbSet<Team> Teams => Set<Team>();
}


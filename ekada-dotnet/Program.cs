using ekada_dotnet.db;
using ekada_dotnet.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddMemoryCache();
string connectionString = "Server=127.0.0.1;Port=3306;Database=ekada-db;User=root;Password=;";
builder.Services.AddDbContext<EkadaContext>(options =>
    options.UseMySQL(connectionString));
builder.Services.AddScoped<DbQuery>();

var app = builder.Build();

var images = app.MapGroup("/images");
var leagues = app.MapGroup("/leagues");
var teams = app.MapGroup("/teams");

leagues.MapGet("/match_schedule/{league}", async (string? league, DbQuery query) =>
{
    var request = await query.GetMatches(league);
    return request is null ? Results.NotFound() : Results.Ok(request);
});

leagues.MapGet("/standings/{*league}", async (string? league, DbQuery query) =>
{
    var request = await query.GetStandings(league);
    return request is null ? Results.NotFound() : Results.Ok(request);
});

leagues.MapGet("/match_data/{game}/{*match}", async (string? match, string? game, DbQuery query) =>
{
    var request = await query.GetMatchData(match, game);
    return request is null ? Results.NotFound() : Results.Ok(request);
});

teams.MapGet("/{team}/{tournament}", async (string? team, string? tournament, DbQuery query) =>
{
    var request = await query.GetTeam(team, tournament);
    return request is null ? Results.NotFound() : Results.Ok(request);
});


app.Run();
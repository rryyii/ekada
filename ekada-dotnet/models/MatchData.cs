using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ekada_dotnet.Models;

[Table("match_data")]
public class MatchData
{
    [Key]
    public int Id {get; set;}
    public string? MatchId { get; set; }
    public string? GameId { get; set; }
    public string? Team { get; set; }
    public string? Side { get; set; }
    public string? Name { get; set; }
    public string? Role { get; set; }
    public string? PlayerWin { get; set; }
    public string? Champion { get; set; }
    public string? Items { get; set; }
    public string? Trinket { get; set; }
    public int Kills { get; set; }
    public int Deaths { get; set; }
    public int Assists { get; set; }
    public int Gold { get; set; }
    public int VisionScore { get; set; }
    public string? SummonerSpells { get; set; }
    public string? Runes { get; set; }
    public int DamageToChampions { get; set; }
}
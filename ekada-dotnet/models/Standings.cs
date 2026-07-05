using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ekada_dotnet.Models;

[Table("standings")]
public class Standings
{
    [Key]
    public int Id {get; set;}
    public required string LeagueName {get; set;}
    public string? Team {get; set;}
    public int Place {get; set;}
    public int WinSeries {get; set;}
    public int LossSeries {get; set;}
    public string? Streak {get; set;}
    public int Points {get; set;}

}
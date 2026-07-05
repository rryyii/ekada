namespace ekada_dotnet.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("series")]
public class Series
{
    [Key]
    public int Id {get; set;}
    
    [MaxLength(255)]
    public string? Tournament {get; set;}

    [MaxLength(255)]
    public string? MatchId {get; set;}

    public int BestOf {get; set;}

    [MaxLength(100)]
    public string? Team1 {get; set;}
    
    public int Team1Score {get; set;}

    [MaxLength(100)]
    public string? Team2 {get; set;}

    public int Team2Score {get; set;}

    public string? Winner {get; set;}

    [Column("DateTime_UTC")]
    public DateTime ScheduledAt {get; set;}

    [MaxLength(255)]
    public string? Split {get; set;}

    public bool IsInternational {get; set;}

}
namespace ekada_dotnet.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("match_schedule")]
public class MatchSchedule
{
    [Key]
    public int Id { get; set; }

    [MaxLength(255)]
    public required string OverviewPage { get; set; }

    [MaxLength(255)]
    public required string Name { get; set; }

    [MaxLength(255)]
    public required string MatchId { get; set; }

    [MaxLength(255)]
    public required string WinTeam { get; set; }

    [MaxLength(255)]
    public required string Winner { get; set; }

    [MaxLength(255)]
    public required string Team1 { get; set; }

    [MaxLength(255)]
    public required string Team1Bans { get; set; }

    [MaxLength(255)]
    public required string Team1Picks { get; set; }

    public int Team1Score { get; set; }
    public int Team1Dragons { get; set; }
    public int Team2Dragons { get; set; }
    public int Team1Barons { get; set; }
    public int Team2Barons { get; set; }
    public int Team1VoidGrubs { get; set; }
    public int Team2VoidGrubs { get; set; }
    public int Team1Towers { get; set; }
    public int Team2Towers { get; set; }
    public int Team1RiftHeralds { get; set; }
    public int Team2RiftHeralds { get; set; }
    public int Team1Atakhans { get; set; }
    public int Team2Atakhans { get; set; }
    public int Team1Gold { get; set; }
    public int Team2Gold { get; set; }

    [MaxLength(255)]
    public required string Team2 { get; set; }

    [MaxLength(255)]
    public required string Team2Bans { get; set; }

    [MaxLength(255)]
    public required string Team2Picks { get; set; }

    public int Team2Score { get; set; }

    [MaxLength(255)]
    public required string Split { get; set; }

    [Column("DateTime_UTC")]
    public DateTime DateTimeUtc { get; set; }

    public double Gamelength { get; set; }

    [MaxLength(255)]
    public required string Patch { get; set; }

    [MaxLength(255)]
    public required string Vod { get; set; }

    public bool IsInternational { get; set; }
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ekada_dotnet.Models;

[Table("team")]
public class Team
{
    [Key]
    public int Id {get; set;}
    public string? TeamName {get; set;}
    public string? Roles {get; set;}
    public string? RosterLinks {get; set;}
    public string? Region {get; set;}
    public string? Tournament {get; set;}
}
using FootballTournament.Domain.Common;
using FootballTournament.Domain.Enums;

namespace FootballTournament.Domain.Entities;

public sealed class Tournament : AuditableEntity
{
    public string NameAr { get; set; } = string.Empty;

    public string NameEn { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string? DescriptionAr { get; set; }

    public string? DescriptionEn { get; set; }

    public string TournamentCode { get; set; } = string.Empty;

    public string? LogoPath { get; set; }

    public string? CoverImagePath { get; set; }

    public string Season { get; set; } = string.Empty;

    public string? Country { get; set; }

    public string? City { get; set; }

    public string? Location { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public DateOnly? RegistrationStartDate { get; set; }

    public DateOnly? RegistrationEndDate { get; set; }

    public int MaximumTeams { get; set; }

    public int MinimumPlayersPerTeam { get; set; }

    public int MaximumPlayersPerTeam { get; set; }

    public TournamentFormat Format { get; set; } = TournamentFormat.GroupStage;

    public int MatchDurationMinutes { get; set; } = 90;

    public int HalfDurationMinutes { get; set; } = 45;

    public int ExtraTimeDurationMinutes { get; set; } = 30;

    public int PointsForWin { get; set; } = 3;

    public int PointsForDraw { get; set; } = 1;

    public int PointsForLoss { get; set; }

    public bool EnableExtraTime { get; set; }

    public bool EnablePenaltyShootout { get; set; }

    public bool EnableHomeAndAway { get; set; }

    public bool EnablePlayerApproval { get; set; } = true;

    public bool EnableTeamApproval { get; set; } = true;

    public bool EnableLiveScore { get; set; } = true;

    public bool EnablePublicVisibility { get; set; }

    public TournamentStatus Status { get; set; } = TournamentStatus.Draft;

    public ICollection<TournamentSupervisor> Supervisors { get; set; } = [];
}

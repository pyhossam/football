using FootballTournament.Domain.Common;
using FootballTournament.Domain.Enums;

namespace FootballTournament.Domain.Entities;

public sealed class Team : AuditableEntity
{
    public Guid TournamentId { get; set; }

    public Tournament Tournament { get; set; } = null!;

    public string NameAr { get; set; } = string.Empty;

    public string NameEn { get; set; } = string.Empty;

    public string ShortName { get; set; } = string.Empty;

    public string TeamCode { get; set; } = string.Empty;

    public string? LogoPath { get; set; }

    public string PrimaryColor { get; set; } = "#0b6b4f";

    public string SecondaryColor { get; set; } = "#d6a536";

    public string? City { get; set; }

    public string? Country { get; set; }

    public DateOnly? FoundationDate { get; set; }

    public string? Description { get; set; }

    public Guid? TeamManagerUserId { get; set; }

    public Guid? CaptainPlayerId { get; set; }

    public Guid? ViceCaptainPlayerId { get; set; }

    public TeamStatus ApprovalStatus { get; set; } = TeamStatus.Draft;

    public TeamRegistrationStatus RegistrationStatus { get; set; } = TeamRegistrationStatus.Draft;

    public bool IsActive { get; set; } = true;
}

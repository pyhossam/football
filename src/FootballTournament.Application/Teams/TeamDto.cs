using FootballTournament.Domain.Enums;

namespace FootballTournament.Application.Teams;

public sealed record TeamDto(
    Guid Id,
    Guid TournamentId,
    string NameAr,
    string NameEn,
    string ShortName,
    string TeamCode,
    string? LogoPath,
    string PrimaryColor,
    string SecondaryColor,
    string? City,
    string? Country,
    DateOnly? FoundationDate,
    string? Description,
    Guid? TeamManagerUserId,
    TeamStatus ApprovalStatus,
    TeamRegistrationStatus RegistrationStatus,
    bool IsActive,
    DateTimeOffset CreatedAt);

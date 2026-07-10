using FootballTournament.Domain.Enums;

namespace FootballTournament.Application.Teams;

public sealed record UpdateTeamRequest(
    string NameAr,
    string NameEn,
    string ShortName,
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
    bool IsActive);

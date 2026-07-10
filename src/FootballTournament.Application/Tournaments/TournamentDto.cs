using FootballTournament.Domain.Enums;

namespace FootballTournament.Application.Tournaments;

public sealed record TournamentDto(
    Guid Id,
    string NameAr,
    string NameEn,
    string Slug,
    string? DescriptionAr,
    string? DescriptionEn,
    string TournamentCode,
    string Season,
    string? Country,
    string? City,
    string? Location,
    DateOnly StartDate,
    DateOnly EndDate,
    int MaximumTeams,
    int MinimumPlayersPerTeam,
    int MaximumPlayersPerTeam,
    TournamentFormat Format,
    TournamentStatus Status,
    bool EnablePublicVisibility,
    IReadOnlyCollection<Guid> SupervisorUserIds,
    IReadOnlyCollection<TournamentSupervisorDto> Supervisors);

public sealed record TournamentSupervisorDto(Guid UserId, string? FullName, string? Email);

using FootballTournament.Domain.Enums;

namespace FootballTournament.Application.Tournaments;

public sealed record TournamentDto(
    Guid Id,
    string NameAr,
    string NameEn,
    string Slug,
    string TournamentCode,
    string Season,
    DateOnly StartDate,
    DateOnly EndDate,
    int MaximumTeams,
    int MinimumPlayersPerTeam,
    int MaximumPlayersPerTeam,
    TournamentFormat Format,
    TournamentStatus Status,
    bool EnablePublicVisibility,
    IReadOnlyCollection<Guid> SupervisorUserIds);

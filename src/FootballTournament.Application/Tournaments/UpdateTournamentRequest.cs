using FootballTournament.Domain.Enums;

namespace FootballTournament.Application.Tournaments;

public sealed record UpdateTournamentRequest(
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
    string? DescriptionAr,
    string? DescriptionEn,
    string? Country,
    string? City,
    string? Location);

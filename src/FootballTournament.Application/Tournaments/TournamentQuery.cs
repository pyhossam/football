namespace FootballTournament.Application.Tournaments;

public sealed record TournamentQuery(int PageNumber = 1, int PageSize = 20, string? Search = null, bool IncludeArchived = false);

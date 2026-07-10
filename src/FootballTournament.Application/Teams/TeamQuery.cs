namespace FootballTournament.Application.Teams;

public sealed record TeamQuery(int PageNumber = 1, int PageSize = 20, string? Search = null, bool IncludeArchived = false);

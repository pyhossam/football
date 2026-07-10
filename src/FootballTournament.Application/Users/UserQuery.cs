namespace FootballTournament.Application.Users;

public sealed record UserQuery(int PageNumber = 1, int PageSize = 20, string? Search = null);

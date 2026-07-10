namespace FootballTournament.Application.Users;

public sealed record CreateUserRequest(
    string Email,
    string Password,
    string? FullName,
    string Role);

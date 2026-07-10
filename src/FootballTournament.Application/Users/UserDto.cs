namespace FootballTournament.Application.Users;

public sealed record UserDto(
    Guid Id,
    string Email,
    string? FullName,
    bool IsActive,
    DateTimeOffset CreatedAt,
    IReadOnlyCollection<string> Roles);

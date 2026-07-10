namespace FootballTournament.Application.Auth;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request, string? ipAddress, CancellationToken cancellationToken);

    Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request, string? ipAddress, CancellationToken cancellationToken);

    Task RevokeRefreshTokenAsync(RefreshTokenRequest request, string? ipAddress, CancellationToken cancellationToken);
}

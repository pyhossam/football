using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using FootballTournament.Application.Auth;
using FootballTournament.Domain.Entities;
using FootballTournament.Domain.Exceptions;
using FootballTournament.Infrastructure.Identity;
using FootballTournament.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace FootballTournament.Infrastructure.Services;

public sealed class AuthService(
    UserManager<ApplicationUser> userManager,
    ApplicationDbContext dbContext,
    IOptions<JwtOptions> jwtOptions) : IAuthService
{
    public async Task<AuthResponse> LoginAsync(LoginRequest request, string? ipAddress, CancellationToken cancellationToken)
    {
        var user = await userManager.Users.FirstOrDefaultAsync(x => x.Email == request.Email, cancellationToken);
        if (user is null || !user.IsActive || !await userManager.CheckPasswordAsync(user, request.Password))
        {
            throw new DomainException("Invalid email or password.");
        }

        var roles = await userManager.GetRolesAsync(user);
        return await IssueTokensAsync(user, roles, null, ipAddress, cancellationToken);
    }

    public async Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request, string? ipAddress, CancellationToken cancellationToken)
    {
        var tokenHash = HashToken(request.RefreshToken);
        var refreshToken = await dbContext.RefreshTokens.FirstOrDefaultAsync(x => x.TokenHash == tokenHash, cancellationToken);

        if (refreshToken is null || !refreshToken.IsActive)
        {
            throw new DomainException("Invalid refresh token.");
        }

        var user = await userManager.FindByIdAsync(refreshToken.UserId.ToString());
        if (user is null || !user.IsActive)
        {
            throw new DomainException("Invalid refresh token.");
        }

        var roles = await userManager.GetRolesAsync(user);
        return await IssueTokensAsync(user, roles, refreshToken, ipAddress, cancellationToken);
    }

    public async Task RevokeRefreshTokenAsync(RefreshTokenRequest request, string? ipAddress, CancellationToken cancellationToken)
    {
        var tokenHash = HashToken(request.RefreshToken);
        var refreshToken = await dbContext.RefreshTokens.FirstOrDefaultAsync(x => x.TokenHash == tokenHash, cancellationToken);
        if (refreshToken is null || !refreshToken.IsActive)
        {
            return;
        }

        refreshToken.RevokedAt = DateTimeOffset.UtcNow;
        refreshToken.RevokedByIp = ipAddress;
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task<AuthResponse> IssueTokensAsync(
        ApplicationUser user,
        IEnumerable<string> roles,
        RefreshToken? previousRefreshToken,
        string? ipAddress,
        CancellationToken cancellationToken)
    {
        var options = jwtOptions.Value;
        if (string.IsNullOrWhiteSpace(options.SigningKey) || options.SigningKey.Length < 32)
        {
            throw new InvalidOperationException("Jwt:SigningKey must be configured with at least 32 characters.");
        }

        var roleList = roles.ToArray();
        var now = DateTimeOffset.UtcNow;
        var expires = now.AddMinutes(options.AccessTokenMinutes);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email ?? string.Empty)
        };
        claims.AddRange(roleList.Select(role => new Claim(ClaimTypes.Role, role)));

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.SigningKey)),
            SecurityAlgorithms.HmacSha256);

        var jwt = new JwtSecurityToken(
            options.Issuer,
            options.Audience,
            claims,
            now.UtcDateTime,
            expires.UtcDateTime,
            credentials);

        var refreshTokenValue = GenerateRefreshToken();
        var refreshTokenHash = HashToken(refreshTokenValue);

        if (previousRefreshToken is not null)
        {
            previousRefreshToken.RevokedAt = now;
            previousRefreshToken.RevokedByIp = ipAddress;
            previousRefreshToken.ReplacedByTokenHash = refreshTokenHash;
        }

        dbContext.RefreshTokens.Add(new RefreshToken
        {
            UserId = user.Id,
            TokenHash = refreshTokenHash,
            ExpiresAt = now.AddDays(options.RefreshTokenDays),
            CreatedByIp = ipAddress
        });
        await dbContext.SaveChangesAsync(cancellationToken);

        return new AuthResponse(
            new JwtSecurityTokenHandler().WriteToken(jwt),
            refreshTokenValue,
            expires,
            user.Email ?? string.Empty,
            roleList);
    }

    private static string GenerateRefreshToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(bytes);
    }

    private static string HashToken(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(bytes);
    }
}

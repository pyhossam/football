using FootballTournament.Application.Common;
using FootballTournament.Application.Users;
using FootballTournament.Domain.Exceptions;
using FootballTournament.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FootballTournament.Infrastructure.Services;

public sealed class UserManagementService(
    UserManager<ApplicationUser> userManager,
    RoleManager<IdentityRole<Guid>> roleManager) : IUserManagementService
{
    public async Task<PagedResult<UserDto>> GetAsync(UserQuery query, CancellationToken cancellationToken)
    {
        var pageNumber = Math.Max(query.PageNumber, 1);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);

        var users = userManager.Users.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLowerInvariant();
            users = users.Where(x =>
                (x.Email != null && x.Email.ToLower().Contains(search)) ||
                (x.FullName != null && x.FullName.ToLower().Contains(search)));
        }

        var total = await users.CountAsync(cancellationToken);
        var page = await users
            .OrderByDescending(x => x.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var items = new List<UserDto>(page.Count);
        foreach (var user in page)
        {
            var roles = await userManager.GetRolesAsync(user);
            items.Add(ToDto(user, roles));
        }

        return new PagedResult<UserDto>(items, pageNumber, pageSize, total);
    }

    public async Task<UserDto> CreateAsync(CreateUserRequest request, CancellationToken cancellationToken)
    {
        if (!await roleManager.RoleExistsAsync(request.Role))
        {
            throw new DomainException("Role is not supported.");
        }

        var existing = await userManager.Users.AnyAsync(x => x.Email == request.Email, cancellationToken);
        if (existing)
        {
            throw new DomainException("A user with the same email already exists.");
        }

        var user = new ApplicationUser
        {
            Email = request.Email.Trim(),
            UserName = request.Email.Trim(),
            FullName = request.FullName?.Trim(),
            EmailConfirmed = true,
            IsActive = true
        };

        var result = await userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            throw new DomainException(string.Join(" ", result.Errors.Select(x => x.Description)));
        }

        var roleResult = await userManager.AddToRoleAsync(user, request.Role);
        if (!roleResult.Succeeded)
        {
            throw new DomainException(string.Join(" ", roleResult.Errors.Select(x => x.Description)));
        }

        return ToDto(user, [request.Role]);
    }

    public async Task<UserDto?> AssignRoleAsync(Guid id, AssignUserRoleRequest request, CancellationToken cancellationToken)
    {
        if (!await roleManager.RoleExistsAsync(request.Role))
        {
            throw new DomainException("Role is not supported.");
        }

        var user = await userManager.Users.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (user is null)
        {
            return null;
        }

        if (!await userManager.IsInRoleAsync(user, request.Role))
        {
            var result = await userManager.AddToRoleAsync(user, request.Role);
            if (!result.Succeeded)
            {
                throw new DomainException(string.Join(" ", result.Errors.Select(x => x.Description)));
            }
        }

        var roles = await userManager.GetRolesAsync(user);
        return ToDto(user, roles);
    }

    private static UserDto ToDto(ApplicationUser user, IEnumerable<string> roles) =>
        new(
            user.Id,
            user.Email ?? string.Empty,
            user.FullName,
            user.IsActive,
            user.CreatedAt,
            roles.ToArray());
}

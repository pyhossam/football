using FootballTournament.Application.Common;

namespace FootballTournament.Application.Users;

public interface IUserManagementService
{
    Task<PagedResult<UserDto>> GetAsync(UserQuery query, CancellationToken cancellationToken);

    Task<UserDto> CreateAsync(CreateUserRequest request, CancellationToken cancellationToken);

    Task<UserDto?> AssignRoleAsync(Guid id, AssignUserRoleRequest request, CancellationToken cancellationToken);
}

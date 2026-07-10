using FootballTournament.Application.Common;
using FootballTournament.Application.Users;
using FootballTournament.Domain.Constants;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FootballTournament.Api.Controllers;

[ApiController]
[Route("api/v1/users")]
[Authorize(Policy = AppPolicies.ManagePlatform)]
public sealed class UsersController(IUserManagementService userManagementService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<UserDto>>>> Get(
        [FromQuery] UserQuery query,
        CancellationToken cancellationToken)
    {
        var result = await userManagementService.GetAsync(query, cancellationToken);
        return Ok(ApiResponse<PagedResult<UserDto>>.Ok(result));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<UserDto>>> Create(
        CreateUserRequest request,
        IValidator<CreateUserRequest> validator,
        CancellationToken cancellationToken)
    {
        var validation = await validator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiResponse<UserDto>.Fail("Validation failed.", validation.ToDictionary()));
        }

        var user = await userManagementService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(Get), ApiResponse<UserDto>.Ok(user));
    }

    [HttpPost("{id:guid}/roles")]
    public async Task<ActionResult<ApiResponse<UserDto>>> AssignRole(
        Guid id,
        AssignUserRoleRequest request,
        IValidator<AssignUserRoleRequest> validator,
        CancellationToken cancellationToken)
    {
        var validation = await validator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiResponse<UserDto>.Fail("Validation failed.", validation.ToDictionary()));
        }

        var user = await userManagementService.AssignRoleAsync(id, request, cancellationToken);
        return user is null
            ? NotFound(ApiResponse<UserDto>.Fail("User was not found."))
            : Ok(ApiResponse<UserDto>.Ok(user));
    }
}

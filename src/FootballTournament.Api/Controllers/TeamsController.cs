using System.Security.Claims;
using FootballTournament.Application.Common;
using FootballTournament.Application.Teams;
using FootballTournament.Domain.Constants;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FootballTournament.Api.Controllers;

[ApiController]
public sealed class TeamsController(ITeamService teamService) : ControllerBase
{
    [HttpGet("api/v1/tournaments/{tournamentId:guid}/teams")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<PagedResult<TeamDto>>>> GetByTournament(
        Guid tournamentId,
        [FromQuery] TeamQuery query,
        CancellationToken cancellationToken)
    {
        var result = await teamService.GetByTournamentAsync(tournamentId, query, cancellationToken);
        return Ok(ApiResponse<PagedResult<TeamDto>>.Ok(result));
    }

    [HttpGet("api/v1/teams/{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<TeamDto>>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var team = await teamService.GetByIdAsync(id, cancellationToken);
        return team is null
            ? NotFound(ApiResponse<TeamDto>.Fail("Team was not found."))
            : Ok(ApiResponse<TeamDto>.Ok(team));
    }

    [HttpPost("api/v1/tournaments/{tournamentId:guid}/teams")]
    [Authorize(Policy = AppPolicies.ManageTournaments)]
    public async Task<ActionResult<ApiResponse<TeamDto>>> Create(
        Guid tournamentId,
        CreateTeamRequest request,
        IValidator<CreateTeamRequest> validator,
        CancellationToken cancellationToken)
    {
        var validation = await validator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiResponse<TeamDto>.Fail("Validation failed.", validation.ToDictionary()));
        }

        var team = await teamService.CreateAsync(tournamentId, request, CurrentUserId(), cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = team.Id }, ApiResponse<TeamDto>.Ok(team));
    }

    [HttpPut("api/v1/teams/{id:guid}")]
    [Authorize(Policy = AppPolicies.ManageTournaments)]
    public async Task<ActionResult<ApiResponse<TeamDto>>> Update(
        Guid id,
        UpdateTeamRequest request,
        IValidator<UpdateTeamRequest> validator,
        CancellationToken cancellationToken)
    {
        var validation = await validator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiResponse<TeamDto>.Fail("Validation failed.", validation.ToDictionary()));
        }

        var team = await teamService.UpdateAsync(id, request, CurrentUserId(), cancellationToken);
        return team is null
            ? NotFound(ApiResponse<TeamDto>.Fail("Team was not found."))
            : Ok(ApiResponse<TeamDto>.Ok(team));
    }

    [HttpDelete("api/v1/teams/{id:guid}")]
    [Authorize(Policy = AppPolicies.ManageTournaments)]
    public async Task<IActionResult> Archive(Guid id, CancellationToken cancellationToken)
    {
        var archived = await teamService.ArchiveAsync(id, CurrentUserId(), cancellationToken);
        return archived ? NoContent() : NotFound(ApiResponse<object>.Fail("Team was not found."));
    }

    private string? CurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier);
}

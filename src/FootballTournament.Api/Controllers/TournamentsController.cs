using System.Security.Claims;
using FootballTournament.Application.Common;
using FootballTournament.Application.Tournaments;
using FootballTournament.Domain.Constants;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FootballTournament.Api.Controllers;

[ApiController]
[Route("api/v1/tournaments")]
public sealed class TournamentsController(ITournamentService tournamentService) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<PagedResult<TournamentDto>>>> Get(
        [FromQuery] TournamentQuery query,
        CancellationToken cancellationToken)
    {
        var result = await tournamentService.GetAsync(query, cancellationToken);
        return Ok(ApiResponse<PagedResult<TournamentDto>>.Ok(result));
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<TournamentDto>>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var tournament = await tournamentService.GetByIdAsync(id, cancellationToken);
        return tournament is null
            ? NotFound(ApiResponse<TournamentDto>.Fail("Tournament was not found."))
            : Ok(ApiResponse<TournamentDto>.Ok(tournament));
    }

    [HttpPost]
    [Authorize(Policy = AppPolicies.ManagePlatform)]
    public async Task<ActionResult<ApiResponse<TournamentDto>>> Create(
        CreateTournamentRequest request,
        IValidator<CreateTournamentRequest> validator,
        CancellationToken cancellationToken)
    {
        var validation = await validator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiResponse<TournamentDto>.Fail("Validation failed.", validation.ToDictionary()));
        }

        var tournament = await tournamentService.CreateAsync(request, CurrentUserId(), cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = tournament.Id }, ApiResponse<TournamentDto>.Ok(tournament));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = AppPolicies.ManageTournaments)]
    public async Task<ActionResult<ApiResponse<TournamentDto>>> Update(
        Guid id,
        UpdateTournamentRequest request,
        IValidator<UpdateTournamentRequest> validator,
        CancellationToken cancellationToken)
    {
        var validation = await validator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiResponse<TournamentDto>.Fail("Validation failed.", validation.ToDictionary()));
        }

        var tournament = await tournamentService.UpdateAsync(id, request, CurrentUserId(), cancellationToken);
        return tournament is null
            ? NotFound(ApiResponse<TournamentDto>.Fail("Tournament was not found."))
            : Ok(ApiResponse<TournamentDto>.Ok(tournament));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = AppPolicies.ManagePlatform)]
    public async Task<IActionResult> Archive(Guid id, CancellationToken cancellationToken)
    {
        var archived = await tournamentService.ArchiveAsync(id, CurrentUserId(), cancellationToken);
        return archived ? NoContent() : NotFound(ApiResponse<object>.Fail("Tournament was not found."));
    }

    [HttpPost("{id:guid}/supervisors")]
    [Authorize(Policy = AppPolicies.ManagePlatform)]
    public async Task<IActionResult> AssignSupervisor(
        Guid id,
        AssignTournamentSupervisorRequest request,
        IValidator<AssignTournamentSupervisorRequest> validator,
        CancellationToken cancellationToken)
    {
        var validation = await validator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiResponse<object>.Fail("Validation failed.", validation.ToDictionary()));
        }

        var assigned = await tournamentService.AssignSupervisorAsync(id, request, CurrentUserId(), cancellationToken);
        return assigned ? NoContent() : NotFound(ApiResponse<object>.Fail("Tournament was not found."));
    }

    private string? CurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier);
}

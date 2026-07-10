using FootballTournament.Application.Common;

namespace FootballTournament.Application.Teams;

public interface ITeamService
{
    Task<PagedResult<TeamDto>> GetByTournamentAsync(Guid tournamentId, TeamQuery query, CancellationToken cancellationToken);

    Task<TeamDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<TeamDto> CreateAsync(
        Guid tournamentId,
        CreateTeamRequest request,
        string? userId,
        bool restrictToAssigned,
        CancellationToken cancellationToken);

    Task<TeamDto?> UpdateAsync(
        Guid id,
        UpdateTeamRequest request,
        string? userId,
        bool restrictToAssigned,
        CancellationToken cancellationToken);

    Task<bool> ArchiveAsync(Guid id, string? userId, bool restrictToAssigned, CancellationToken cancellationToken);
}

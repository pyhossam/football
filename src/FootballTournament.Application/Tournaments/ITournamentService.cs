using FootballTournament.Application.Common;

namespace FootballTournament.Application.Tournaments;

public interface ITournamentService
{
    Task<PagedResult<TournamentDto>> GetAsync(TournamentQuery query, CancellationToken cancellationToken);

    Task<TournamentDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<TournamentDto> CreateAsync(CreateTournamentRequest request, string? userId, CancellationToken cancellationToken);

    Task<TournamentDto?> UpdateAsync(Guid id, UpdateTournamentRequest request, string? userId, CancellationToken cancellationToken);

    Task<bool> ArchiveAsync(Guid id, string? userId, CancellationToken cancellationToken);

    Task<bool> AssignSupervisorAsync(Guid id, AssignTournamentSupervisorRequest request, string? userId, CancellationToken cancellationToken);
}

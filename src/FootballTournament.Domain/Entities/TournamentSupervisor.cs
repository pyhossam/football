using FootballTournament.Domain.Common;

namespace FootballTournament.Domain.Entities;

public sealed class TournamentSupervisor : AuditableEntity
{
    public Guid TournamentId { get; set; }

    public Tournament Tournament { get; set; } = null!;

    public Guid UserId { get; set; }
}

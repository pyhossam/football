namespace FootballTournament.Domain.Constants;

public static class AppRoles
{
    public const string GeneralAdmin = nameof(GeneralAdmin);
    public const string TournamentSupervisor = nameof(TournamentSupervisor);
    public const string TeamManager = nameof(TeamManager);

    public static readonly string[] All =
    [
        GeneralAdmin,
        TournamentSupervisor,
        TeamManager
    ];
}

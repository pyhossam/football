using FluentValidation;

namespace FootballTournament.Application.Tournaments.Validators;

public sealed class AssignTournamentSupervisorRequestValidator : AbstractValidator<AssignTournamentSupervisorRequest>
{
    public AssignTournamentSupervisorRequestValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
    }
}

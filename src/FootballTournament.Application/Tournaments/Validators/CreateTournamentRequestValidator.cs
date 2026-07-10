using FluentValidation;

namespace FootballTournament.Application.Tournaments.Validators;

public sealed class CreateTournamentRequestValidator : AbstractValidator<CreateTournamentRequest>
{
    public CreateTournamentRequestValidator()
    {
        RuleFor(x => x.NameAr).NotEmpty().MaximumLength(200);
        RuleFor(x => x.NameEn).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Slug).NotEmpty().MaximumLength(220).Matches("^[a-z0-9]+(?:-[a-z0-9]+)*$");
        RuleFor(x => x.TournamentCode).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Season).NotEmpty().MaximumLength(50);
        RuleFor(x => x.EndDate).GreaterThanOrEqualTo(x => x.StartDate);
        RuleFor(x => x.MaximumTeams).GreaterThanOrEqualTo(2);
        RuleFor(x => x.MinimumPlayersPerTeam).InclusiveBetween(1, 99);
        RuleFor(x => x.MaximumPlayersPerTeam).GreaterThanOrEqualTo(x => x.MinimumPlayersPerTeam).LessThanOrEqualTo(99);
    }
}

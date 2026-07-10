using FluentValidation;

namespace FootballTournament.Application.Teams.Validators;

public sealed class UpdateTeamRequestValidator : AbstractValidator<UpdateTeamRequest>
{
    public UpdateTeamRequestValidator()
    {
        RuleFor(x => x.NameAr).NotEmpty().MaximumLength(200);
        RuleFor(x => x.NameEn).NotEmpty().MaximumLength(200);
        RuleFor(x => x.ShortName).NotEmpty().MaximumLength(30);
        RuleFor(x => x.PrimaryColor).NotEmpty().Matches("^#[0-9A-Fa-f]{6}$");
        RuleFor(x => x.SecondaryColor).NotEmpty().Matches("^#[0-9A-Fa-f]{6}$");
        RuleFor(x => x.City).MaximumLength(120);
        RuleFor(x => x.Country).MaximumLength(120);
        RuleFor(x => x.Description).MaximumLength(1000);
    }
}

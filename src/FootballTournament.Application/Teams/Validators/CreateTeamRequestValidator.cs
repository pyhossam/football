using FluentValidation;

namespace FootballTournament.Application.Teams.Validators;

public sealed class CreateTeamRequestValidator : AbstractValidator<CreateTeamRequest>
{
    public CreateTeamRequestValidator()
    {
        RuleFor(x => x.NameAr).NotEmpty().MaximumLength(200);
        RuleFor(x => x.NameEn).NotEmpty().MaximumLength(200);
        RuleFor(x => x.ShortName).NotEmpty().MaximumLength(30);
        RuleFor(x => x.TeamCode).NotEmpty().MaximumLength(50).Matches("^[A-Z0-9-]+$");
        RuleFor(x => x.LogoPath).Must(BeImageReference).When(x => !string.IsNullOrWhiteSpace(x.LogoPath));
        RuleFor(x => x.PrimaryColor).NotEmpty().Matches("^#[0-9A-Fa-f]{6}$");
        RuleFor(x => x.SecondaryColor).NotEmpty().Matches("^#[0-9A-Fa-f]{6}$");
        RuleFor(x => x.City).MaximumLength(120);
        RuleFor(x => x.Country).MaximumLength(120);
        RuleFor(x => x.Description).MaximumLength(1000);
    }

    private static bool BeImageReference(string? value)
    {
        return value is null ||
            value.StartsWith("data:image/", StringComparison.OrdinalIgnoreCase) ||
            value.StartsWith("http://", StringComparison.OrdinalIgnoreCase) ||
            value.StartsWith("https://", StringComparison.OrdinalIgnoreCase) ||
            value.StartsWith("/", StringComparison.OrdinalIgnoreCase);
    }
}

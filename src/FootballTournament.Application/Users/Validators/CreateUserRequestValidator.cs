using FootballTournament.Domain.Constants;
using FluentValidation;

namespace FootballTournament.Application.Users.Validators;

public sealed class CreateUserRequestValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(256);
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8).MaximumLength(128);
        RuleFor(x => x.FullName).MaximumLength(180);
        RuleFor(x => x.Role)
            .NotEmpty()
            .Must(role => AppRoles.All.Contains(role))
            .WithMessage("Role is not supported.");
    }
}

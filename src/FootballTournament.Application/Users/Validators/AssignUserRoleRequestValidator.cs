using FootballTournament.Domain.Constants;
using FluentValidation;

namespace FootballTournament.Application.Users.Validators;

public sealed class AssignUserRoleRequestValidator : AbstractValidator<AssignUserRoleRequest>
{
    public AssignUserRoleRequestValidator()
    {
        RuleFor(x => x.Role)
            .NotEmpty()
            .Must(role => AppRoles.All.Contains(role))
            .WithMessage("Role is not supported.");
    }
}

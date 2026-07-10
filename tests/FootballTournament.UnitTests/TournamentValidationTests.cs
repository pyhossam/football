using FluentValidation.TestHelper;
using FootballTournament.Application.Tournaments;
using FootballTournament.Application.Tournaments.Validators;
using FootballTournament.Domain.Enums;

namespace FootballTournament.UnitTests;

public sealed class TournamentValidationTests
{
    private readonly CreateTournamentRequestValidator _validator = new();

    [Fact]
    public void CreateTournament_rejects_end_date_before_start_date()
    {
        var request = ValidRequest() with
        {
            StartDate = new DateOnly(2026, 9, 10),
            EndDate = new DateOnly(2026, 9, 1)
        };

        var result = _validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(x => x.EndDate);
    }

    [Fact]
    public void CreateTournament_rejects_invalid_slug()
    {
        var request = ValidRequest() with { Slug = "Invalid Slug" };

        var result = _validator.TestValidate(request);

        result.ShouldHaveValidationErrorFor(x => x.Slug);
    }

    [Fact]
    public void CreateTournament_accepts_minimum_valid_foundation_payload()
    {
        var result = _validator.TestValidate(ValidRequest());

        result.ShouldNotHaveAnyValidationErrors();
    }

    private static CreateTournamentRequest ValidRequest() =>
        new(
            "كأس الاختبار",
            "Test Cup",
            "test-cup",
            "TEST-CUP",
            "2026",
            new DateOnly(2026, 9, 1),
            new DateOnly(2026, 9, 30),
            8,
            7,
            22,
            TournamentFormat.GroupStage,
            null,
            null,
            "Saudi Arabia",
            "Riyadh",
            null);
}

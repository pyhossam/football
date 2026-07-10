using FootballTournament.Domain.Constants;
using FootballTournament.Domain.Entities;
using FootballTournament.Domain.Enums;
using FootballTournament.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace FootballTournament.Infrastructure.Persistence;

public sealed class DatabaseSeeder(
    ApplicationDbContext dbContext,
    RoleManager<IdentityRole<Guid>> roleManager,
    UserManager<ApplicationUser> userManager,
    IConfiguration configuration,
    ILogger<DatabaseSeeder> logger)
{
    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        await dbContext.Database.MigrateAsync(cancellationToken);

        foreach (var roleName in AppRoles.All)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(roleName));
            }
        }

        var adminEmail = configuration["Seed:AdminEmail"] ?? "admin@football.local";
        var adminPassword = configuration["Seed:AdminPassword"];

        if (!string.IsNullOrWhiteSpace(adminPassword))
        {
            var admin = await userManager.Users.FirstOrDefaultAsync(x => x.Email == adminEmail, cancellationToken);
            if (admin is null)
            {
                admin = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true,
                    FullName = "General Administrator"
                };

                var created = await userManager.CreateAsync(admin, adminPassword);
                if (!created.Succeeded)
                {
                    logger.LogWarning("Unable to create development admin user: {Errors}", string.Join(", ", created.Errors.Select(x => x.Description)));
                }
            }

            if (admin is not null && !await userManager.IsInRoleAsync(admin, AppRoles.GeneralAdmin))
            {
                await userManager.AddToRoleAsync(admin, AppRoles.GeneralAdmin);
            }
        }
        else
        {
            logger.LogInformation("Seed:AdminPassword is empty; development admin user was not created.");
        }

        if (!await dbContext.Tournaments.AnyAsync(cancellationToken))
        {
            dbContext.Tournaments.Add(new Tournament
            {
                NameAr = "كأس المجتمع",
                NameEn = "Community Cup",
                Slug = "community-cup",
                TournamentCode = "COMMUNITY-CUP",
                Season = "2026",
                StartDate = new DateOnly(2026, 8, 1),
                EndDate = new DateOnly(2026, 8, 31),
                MaximumTeams = 16,
                MinimumPlayersPerTeam = 7,
                MaximumPlayersPerTeam = 25,
                Format = TournamentFormat.GroupStageAndKnockout,
                Status = TournamentStatus.Draft,
                EnablePublicVisibility = true,
                Country = "Saudi Arabia",
                City = "Riyadh"
            });
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}

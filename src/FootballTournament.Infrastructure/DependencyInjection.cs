using FootballTournament.Application.Auth;
using FootballTournament.Application.Tournaments;
using FootballTournament.Domain.Constants;
using FootballTournament.Infrastructure.Identity;
using FootballTournament.Infrastructure.Persistence;
using FootballTournament.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace FootballTournament.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
            {
                options.Password.RequiredLength = 8;
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        var jwt = configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>() ?? new JwtOptions();
        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwt.Issuer,
                    ValidAudience = jwt.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.SigningKey)),
                    ClockSkew = TimeSpan.FromMinutes(1)
                };
            });

        services.AddAuthorization(ConfigureAuthorization);
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ITournamentService, TournamentService>();
        services.AddApplicationScoped("FootballTournament.Application.Teams.ITeamService", typeof(TeamService));
        services.AddApplicationScoped("FootballTournament.Application.Users.IUserManagementService", typeof(UserManagementService));
        services.AddScoped<DatabaseSeeder>();

        return services;
    }

    private static void ConfigureAuthorization(AuthorizationOptions options)
    {
        options.AddPolicy(AppPolicies.ManagePlatform, policy => policy.RequireRole(AppRoles.GeneralAdmin));
        options.AddPolicy(AppPolicies.ManageTournaments, policy => policy.RequireRole(AppRoles.GeneralAdmin, AppRoles.TournamentSupervisor));
        options.AddPolicy(AppPolicies.ManageTeams, policy => policy.RequireRole(AppRoles.GeneralAdmin, AppRoles.TournamentSupervisor, AppRoles.TeamManager));
    }

    private static IServiceCollection AddApplicationScoped(this IServiceCollection services, string serviceTypeName, Type implementationType)
    {
        var serviceType = Type.GetType($"{serviceTypeName}, FootballTournament.Application", throwOnError: true)!;
        services.AddScoped(serviceType, implementationType);
        return services;
    }
}

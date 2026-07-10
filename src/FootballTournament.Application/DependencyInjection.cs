using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace FootballTournament.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);
        services.AddAutoMapper(_ => { }, typeof(DependencyInjection).Assembly);
        return services;
    }
}

using AutoMapper;
using FootballTournament.Domain.Entities;

namespace FootballTournament.Application.Tournaments;

public sealed class TournamentMappingProfile : Profile
{
    public TournamentMappingProfile()
    {
        CreateMap<Tournament, TournamentDto>()
            .ForCtorParam(nameof(TournamentDto.SupervisorUserIds), opt => opt.MapFrom(src => src.Supervisors.Select(x => x.UserId).ToArray()));
    }
}

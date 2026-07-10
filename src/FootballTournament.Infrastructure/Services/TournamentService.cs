using AutoMapper;
using AutoMapper.QueryableExtensions;
using FootballTournament.Application.Common;
using FootballTournament.Application.Tournaments;
using FootballTournament.Domain.Entities;
using FootballTournament.Domain.Exceptions;
using FootballTournament.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FootballTournament.Infrastructure.Services;

public sealed class TournamentService(ApplicationDbContext dbContext, IMapper mapper) : ITournamentService
{
    public async Task<PagedResult<TournamentDto>> GetAsync(TournamentQuery query, CancellationToken cancellationToken)
    {
        var pageNumber = Math.Max(query.PageNumber, 1);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);

        var tournaments = dbContext.Tournaments
            .AsNoTracking()
            .Include(x => x.Supervisors)
            .AsQueryable();

        if (query.IncludeArchived)
        {
            tournaments = dbContext.Tournaments
                .IgnoreQueryFilters()
                .AsNoTracking()
                .Include(x => x.Supervisors);
        }

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLowerInvariant();
            tournaments = tournaments.Where(x =>
                x.NameAr.ToLower().Contains(search) ||
                x.NameEn.ToLower().Contains(search) ||
                x.Slug.ToLower().Contains(search) ||
                x.TournamentCode.ToLower().Contains(search));
        }

        var total = await tournaments.CountAsync(cancellationToken);
        var items = await tournaments
            .OrderByDescending(x => x.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ProjectTo<TournamentDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return new PagedResult<TournamentDto>(items, pageNumber, pageSize, total);
    }

    public async Task<TournamentDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await dbContext.Tournaments
            .AsNoTracking()
            .Include(x => x.Supervisors)
            .Where(x => x.Id == id)
            .ProjectTo<TournamentDto>(mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<TournamentDto> CreateAsync(CreateTournamentRequest request, string? userId, CancellationToken cancellationToken)
    {
        if (await dbContext.Tournaments.AnyAsync(x => x.Slug == request.Slug || x.TournamentCode == request.TournamentCode, cancellationToken))
        {
            throw new DomainException("Tournament slug or code already exists.");
        }

        var tournament = new Tournament
        {
            NameAr = request.NameAr.Trim(),
            NameEn = request.NameEn.Trim(),
            Slug = request.Slug.Trim(),
            TournamentCode = request.TournamentCode.Trim(),
            Season = request.Season.Trim(),
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            MaximumTeams = request.MaximumTeams,
            MinimumPlayersPerTeam = request.MinimumPlayersPerTeam,
            MaximumPlayersPerTeam = request.MaximumPlayersPerTeam,
            Format = request.Format,
            DescriptionAr = request.DescriptionAr,
            DescriptionEn = request.DescriptionEn,
            Country = request.Country,
            City = request.City,
            Location = request.Location,
            CreatedBy = userId
        };

        dbContext.Tournaments.Add(tournament);
        await dbContext.SaveChangesAsync(cancellationToken);
        return mapper.Map<TournamentDto>(tournament);
    }

    public async Task<TournamentDto?> UpdateAsync(Guid id, UpdateTournamentRequest request, string? userId, CancellationToken cancellationToken)
    {
        var tournament = await dbContext.Tournaments.Include(x => x.Supervisors).FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (tournament is null)
        {
            return null;
        }

        var duplicate = await dbContext.Tournaments.AnyAsync(x => x.Id != id && x.Slug == request.Slug, cancellationToken);
        if (duplicate)
        {
            throw new DomainException("Tournament slug already exists.");
        }

        tournament.NameAr = request.NameAr.Trim();
        tournament.NameEn = request.NameEn.Trim();
        tournament.Slug = request.Slug.Trim();
        tournament.Season = request.Season.Trim();
        tournament.StartDate = request.StartDate;
        tournament.EndDate = request.EndDate;
        tournament.MaximumTeams = request.MaximumTeams;
        tournament.MinimumPlayersPerTeam = request.MinimumPlayersPerTeam;
        tournament.MaximumPlayersPerTeam = request.MaximumPlayersPerTeam;
        tournament.Format = request.Format;
        tournament.Status = request.Status;
        tournament.EnablePublicVisibility = request.EnablePublicVisibility;
        tournament.DescriptionAr = request.DescriptionAr;
        tournament.DescriptionEn = request.DescriptionEn;
        tournament.Country = request.Country;
        tournament.City = request.City;
        tournament.Location = request.Location;
        tournament.UpdatedAt = DateTimeOffset.UtcNow;
        tournament.UpdatedBy = userId;

        await dbContext.SaveChangesAsync(cancellationToken);
        return mapper.Map<TournamentDto>(tournament);
    }

    public async Task<bool> ArchiveAsync(Guid id, string? userId, CancellationToken cancellationToken)
    {
        var tournament = await dbContext.Tournaments.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (tournament is null)
        {
            return false;
        }

        tournament.IsDeleted = true;
        tournament.DeletedAt = DateTimeOffset.UtcNow;
        tournament.UpdatedBy = userId;
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> AssignSupervisorAsync(Guid id, AssignTournamentSupervisorRequest request, string? userId, CancellationToken cancellationToken)
    {
        var exists = await dbContext.Tournaments.AnyAsync(x => x.Id == id, cancellationToken);
        if (!exists)
        {
            return false;
        }

        var alreadyAssigned = await dbContext.TournamentSupervisors.AnyAsync(x => x.TournamentId == id && x.UserId == request.UserId, cancellationToken);
        if (alreadyAssigned)
        {
            return true;
        }

        dbContext.TournamentSupervisors.Add(new TournamentSupervisor
        {
            TournamentId = id,
            UserId = request.UserId,
            CreatedBy = userId
        });
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}

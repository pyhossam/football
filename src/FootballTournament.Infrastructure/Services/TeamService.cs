using FootballTournament.Application.Common;
using FootballTournament.Application.Teams;
using FootballTournament.Domain.Entities;
using FootballTournament.Domain.Exceptions;
using FootballTournament.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FootballTournament.Infrastructure.Services;

public sealed class TeamService(ApplicationDbContext dbContext) : ITeamService
{
    public async Task<PagedResult<TeamDto>> GetByTournamentAsync(Guid tournamentId, TeamQuery query, CancellationToken cancellationToken)
    {
        var pageNumber = Math.Max(query.PageNumber, 1);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);

        var teams = dbContext.Teams.AsNoTracking().Where(x => x.TournamentId == tournamentId);
        if (query.IncludeArchived)
        {
            teams = dbContext.Teams.IgnoreQueryFilters().AsNoTracking().Where(x => x.TournamentId == tournamentId);
        }

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLowerInvariant();
            teams = teams.Where(x =>
                x.NameAr.ToLower().Contains(search) ||
                x.NameEn.ToLower().Contains(search) ||
                x.ShortName.ToLower().Contains(search) ||
                x.TeamCode.ToLower().Contains(search));
        }

        var total = await teams.CountAsync(cancellationToken);
        var items = await teams
            .OrderBy(x => x.NameEn)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(x => ToDto(x))
            .ToListAsync(cancellationToken);

        return new PagedResult<TeamDto>(items, pageNumber, pageSize, total);
    }

    public async Task<TeamDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await dbContext.Teams
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => ToDto(x))
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<TeamDto> CreateAsync(Guid tournamentId, CreateTeamRequest request, string? userId, CancellationToken cancellationToken)
    {
        var tournamentExists = await dbContext.Tournaments.AnyAsync(x => x.Id == tournamentId, cancellationToken);
        if (!tournamentExists)
        {
            throw new DomainException("Tournament was not found.");
        }

        var duplicate = await dbContext.Teams.AnyAsync(x =>
            x.TournamentId == tournamentId &&
            (x.TeamCode == request.TeamCode || x.NameAr == request.NameAr || x.NameEn == request.NameEn),
            cancellationToken);

        if (duplicate)
        {
            throw new DomainException("A team with the same code or name already exists in this tournament.");
        }

        var team = new Team
        {
            TournamentId = tournamentId,
            NameAr = request.NameAr.Trim(),
            NameEn = request.NameEn.Trim(),
            ShortName = request.ShortName.Trim(),
            TeamCode = request.TeamCode.Trim().ToUpperInvariant(),
            PrimaryColor = request.PrimaryColor,
            SecondaryColor = request.SecondaryColor,
            City = request.City,
            Country = request.Country,
            FoundationDate = request.FoundationDate,
            Description = request.Description,
            TeamManagerUserId = request.TeamManagerUserId,
            CreatedBy = userId
        };

        dbContext.Teams.Add(team);
        await dbContext.SaveChangesAsync(cancellationToken);
        return ToDto(team);
    }

    public async Task<TeamDto?> UpdateAsync(Guid id, UpdateTeamRequest request, string? userId, CancellationToken cancellationToken)
    {
        var team = await dbContext.Teams.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (team is null)
        {
            return null;
        }

        var duplicate = await dbContext.Teams.AnyAsync(x =>
            x.Id != id &&
            x.TournamentId == team.TournamentId &&
            (x.NameAr == request.NameAr || x.NameEn == request.NameEn),
            cancellationToken);

        if (duplicate)
        {
            throw new DomainException("A team with the same name already exists in this tournament.");
        }

        team.NameAr = request.NameAr.Trim();
        team.NameEn = request.NameEn.Trim();
        team.ShortName = request.ShortName.Trim();
        team.PrimaryColor = request.PrimaryColor;
        team.SecondaryColor = request.SecondaryColor;
        team.City = request.City;
        team.Country = request.Country;
        team.FoundationDate = request.FoundationDate;
        team.Description = request.Description;
        team.TeamManagerUserId = request.TeamManagerUserId;
        team.ApprovalStatus = request.ApprovalStatus;
        team.RegistrationStatus = request.RegistrationStatus;
        team.IsActive = request.IsActive;
        team.UpdatedAt = DateTimeOffset.UtcNow;
        team.UpdatedBy = userId;

        await dbContext.SaveChangesAsync(cancellationToken);
        return ToDto(team);
    }

    public async Task<bool> ArchiveAsync(Guid id, string? userId, CancellationToken cancellationToken)
    {
        var team = await dbContext.Teams.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (team is null)
        {
            return false;
        }

        team.IsDeleted = true;
        team.DeletedAt = DateTimeOffset.UtcNow;
        team.UpdatedBy = userId;
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static TeamDto ToDto(Team team) =>
        new(
            team.Id,
            team.TournamentId,
            team.NameAr,
            team.NameEn,
            team.ShortName,
            team.TeamCode,
            team.PrimaryColor,
            team.SecondaryColor,
            team.City,
            team.Country,
            team.TeamManagerUserId,
            team.ApprovalStatus,
            team.RegistrationStatus,
            team.IsActive,
            team.CreatedAt);
}

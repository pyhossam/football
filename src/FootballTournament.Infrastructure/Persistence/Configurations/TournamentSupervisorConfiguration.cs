using FootballTournament.Domain.Entities;
using FootballTournament.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FootballTournament.Infrastructure.Persistence.Configurations;

internal sealed class TournamentSupervisorConfiguration : IEntityTypeConfiguration<TournamentSupervisor>
{
    public void Configure(EntityTypeBuilder<TournamentSupervisor> builder)
    {
        builder.ToTable("TournamentSupervisors");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.RowVersion).IsRowVersion();
        builder.HasIndex(x => new { x.TournamentId, x.UserId }).IsUnique();
        builder.HasQueryFilter(x => !x.IsDeleted);
        builder.HasOne(x => x.Tournament)
            .WithMany(x => x.Supervisors)
            .HasForeignKey(x => x.TournamentId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne<ApplicationUser>()
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

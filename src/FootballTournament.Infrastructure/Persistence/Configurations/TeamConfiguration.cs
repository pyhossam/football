using FootballTournament.Domain.Entities;
using FootballTournament.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FootballTournament.Infrastructure.Persistence.Configurations;

internal sealed class TeamConfiguration : IEntityTypeConfiguration<Team>
{
    public void Configure(EntityTypeBuilder<Team> builder)
    {
        builder.ToTable("Teams");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.NameAr).HasMaxLength(200).IsRequired();
        builder.Property(x => x.NameEn).HasMaxLength(200).IsRequired();
        builder.Property(x => x.ShortName).HasMaxLength(30).IsRequired();
        builder.Property(x => x.TeamCode).HasMaxLength(50).IsRequired();
        builder.Property(x => x.PrimaryColor).HasMaxLength(7).IsRequired();
        builder.Property(x => x.SecondaryColor).HasMaxLength(7).IsRequired();
        builder.Property(x => x.City).HasMaxLength(120);
        builder.Property(x => x.Country).HasMaxLength(120);
        builder.Property(x => x.Description).HasMaxLength(1000);
        builder.Property(x => x.RowVersion)
            .HasDefaultValue(Array.Empty<byte>())
            .IsConcurrencyToken();
        builder.HasIndex(x => new { x.TournamentId, x.TeamCode }).IsUnique();
        builder.HasIndex(x => new { x.TournamentId, x.NameAr }).IsUnique();
        builder.HasIndex(x => new { x.TournamentId, x.NameEn }).IsUnique();
        builder.HasIndex(x => x.ApprovalStatus);
        builder.HasQueryFilter(x => !x.IsDeleted);
        builder.HasOne(x => x.Tournament)
            .WithMany()
            .HasForeignKey(x => x.TournamentId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne<ApplicationUser>()
            .WithMany()
            .HasForeignKey(x => x.TeamManagerUserId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

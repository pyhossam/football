using FootballTournament.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FootballTournament.Infrastructure.Persistence.Configurations;

internal sealed class TournamentConfiguration : IEntityTypeConfiguration<Tournament>
{
    public void Configure(EntityTypeBuilder<Tournament> builder)
    {
        builder.ToTable("Tournaments");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.NameAr).HasMaxLength(200).IsRequired();
        builder.Property(x => x.NameEn).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Slug).HasMaxLength(220).IsRequired();
        builder.Property(x => x.TournamentCode).HasMaxLength(50).IsRequired();
        builder.Property(x => x.Season).HasMaxLength(50).IsRequired();
        builder.Property(x => x.Country).HasMaxLength(120);
        builder.Property(x => x.City).HasMaxLength(120);
        builder.Property(x => x.Location).HasMaxLength(250);
        builder.Property(x => x.RowVersion)
            .HasDefaultValue(Array.Empty<byte>())
            .IsConcurrencyToken();
        builder.HasIndex(x => x.Slug).IsUnique();
        builder.HasIndex(x => x.TournamentCode).IsUnique();
        builder.HasIndex(x => x.Status);
        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}

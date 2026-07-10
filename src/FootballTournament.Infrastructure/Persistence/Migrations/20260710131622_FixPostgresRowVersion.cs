using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FootballTournament.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixPostgresRowVersion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<byte[]>(
                name: "RowVersion",
                table: "TournamentSupervisors",
                type: "bytea",
                nullable: false,
                defaultValue: new byte[0],
                oldClrType: typeof(byte[]),
                oldType: "bytea",
                oldRowVersion: true);

            migrationBuilder.AlterColumn<byte[]>(
                name: "RowVersion",
                table: "Tournaments",
                type: "bytea",
                nullable: false,
                defaultValue: new byte[0],
                oldClrType: typeof(byte[]),
                oldType: "bytea",
                oldRowVersion: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<byte[]>(
                name: "RowVersion",
                table: "TournamentSupervisors",
                type: "bytea",
                rowVersion: true,
                nullable: false,
                oldClrType: typeof(byte[]),
                oldType: "bytea",
                oldDefaultValue: new byte[0]);

            migrationBuilder.AlterColumn<byte[]>(
                name: "RowVersion",
                table: "Tournaments",
                type: "bytea",
                rowVersion: true,
                nullable: false,
                oldClrType: typeof(byte[]),
                oldType: "bytea",
                oldDefaultValue: new byte[0]);
        }
    }
}

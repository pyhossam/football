namespace FootballTournament.Application.Teams;

public sealed record CreateTeamRequest(
    string NameAr,
    string NameEn,
    string ShortName,
    string TeamCode,
    string PrimaryColor,
    string SecondaryColor,
    string? City,
    string? Country,
    DateOnly? FoundationDate,
    string? Description,
    Guid? TeamManagerUserId);

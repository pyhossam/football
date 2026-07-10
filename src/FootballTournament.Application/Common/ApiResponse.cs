namespace FootballTournament.Application.Common;

public sealed record ApiResponse<T>(bool Succeeded, T? Data, string? Message = null, IDictionary<string, string[]>? Errors = null)
{
    public static ApiResponse<T> Ok(T data, string? message = null) => new(true, data, message);

    public static ApiResponse<T> Fail(string message, IDictionary<string, string[]>? errors = null) => new(false, default, message, errors);
}

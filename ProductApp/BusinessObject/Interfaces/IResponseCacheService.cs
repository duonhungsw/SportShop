namespace BusinessObject.Interfaces;

public interface IResponseCacheService
{
    Task CacheResponseAsync(string cacheKey, object response, TimeSpan timeToLive);
    Task<string?> GetCacheResponseAsync(string cacheKey);
    Task RemoveCacheByPattern(string pattern);
}

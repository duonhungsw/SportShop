using BusinessObject.Interfaces;
using StackExchange.Redis;
using System.Text.Json;

namespace DataAccess.Services;

public class ResponseCacheService(IConnectionMultiplexer redis) : IResponseCacheService
{
    private readonly IDatabase _database = redis.GetDatabase(1);

    public async Task CacheResponseAsync(string cacheKey, object response, TimeSpan timeToLive)
    {
        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var serializerResponse = JsonSerializer.Serialize(response, options);
        await _database.StringSetAsync(cacheKey, serializerResponse, timeToLive);
    }

    public async Task<string?> GetCacheResponseAsync(string cacheKey)
    {
        var cachedRespone = await _database.StringGetAsync(cacheKey);
        if (cacheKey == null) return null;
        return cachedRespone;
    }

    public async Task RemoveCacheByPattern(string pattern)
    {
        var server = redis.GetServer(redis.GetEndPoints().First());
        var keys = server.Keys(database: 1, pattern: $"*{pattern}*").ToArray();

        if (keys.Length != 0)
        {
            await _database.KeyDeleteAsync(keys);
        }
    }
}

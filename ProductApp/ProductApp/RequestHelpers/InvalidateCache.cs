using BusinessObject.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ProductApp.RequestHelpers
{
    [AttributeUsage(AttributeTargets.Method)]
    public class InvalidateCache(string pattern) : Attribute, IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext  =await next();
            if (resultContext.Exception == null || resultContext.ExceptionHandled)
            {
                var cacheService = context.HttpContext.RequestServices.GetRequiredService<IResponseCacheService>();

                await cacheService.RemoveCacheByPattern(pattern);
            }
        }
    }
}

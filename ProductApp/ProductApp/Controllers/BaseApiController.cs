using BusinessObject.Interfaces;
using BusinessObject.Entities;
using Microsoft.AspNetCore.Mvc;
using ProductApp.RequestHelpers;

namespace ProductApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : ControllerBase
    {
        protected async Task<ActionResult> CreatePagedResult<T>
            (IGenericRepository<T> repo, ISpecification<T> spec, int pageIndex, int pageSize) where T: BaseEntity
        {
            var items = await repo.ListAsync(spec);
            var counts = await repo.CountAsync(spec);
            var pagination = new Pagination<T>(pageIndex, pageSize, counts, items);
            return Ok(pagination);
        }
    }
}

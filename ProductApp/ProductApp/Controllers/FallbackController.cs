using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ProductApp.Controllers
{
    public class FallbackController : BaseApiController
    {
        [HttpGet]   
        public ActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
                "my-app", "index.html"), "text/html");
        }
    }
}

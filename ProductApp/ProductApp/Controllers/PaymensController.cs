using BusinessObject.Entities;
using BusinessObject.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ProductApp.Controllers
{
    public class PaymensController(IPaymentService paymentService, IUnitOfWork unit) : BaseApiController
    {
        [Authorize]
        [HttpPost("{cartId}")]
        public async Task<ActionResult<DeliveryMethod>> CreateOrUpdatePaymentIntent(string cartId)
        {
            var cart = await paymentService.CreateOrUpdatePaymentIntent(cartId);
            if (cart == null) return BadRequest("Problem with your cart");
            return Ok(cart);
        }
        [HttpGet("delivery-methods")]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetPaymentMethod()
        {
            return Ok(await unit.Repository<DeliveryMethod>().GetAllAsync());
        }
    }
}

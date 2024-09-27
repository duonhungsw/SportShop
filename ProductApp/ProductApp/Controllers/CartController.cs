using BusinessObject.Entities;
using BusinessObject.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ProductApp.Controllers
{

    public class CartController(ICartService cartService) : BaseApiController
    {
        [HttpGet("GetCartById")]
        public async Task<ActionResult<ShoppingCart>> GetCartById(string id)
        {
            var cart = await cartService.GetCartAsync(id);
            return Ok(cart ?? new ShoppingCart { Id = id });
        }
        [HttpPost("UpdateCart")]
        public async Task<ActionResult<ShoppingCart>> UpdateCart(ShoppingCart cart)
        {
            var updateCart = await cartService.SetCartAsync(cart);

            if (updateCart == null) return BadRequest("Problem with cart");

            return updateCart;
        }
        [HttpDelete("DeleteCart")]
        public async Task<ActionResult> DeleteCart(string id)
        {
            var result = await cartService.DeleteCartAsync(id);

            if (!result) return BadRequest("Problem deleting cart");

            return Ok();
        }
    }
}

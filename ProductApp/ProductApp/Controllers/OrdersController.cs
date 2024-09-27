using BusinessObject.Entities;
using BusinessObject.Entities.OrderAddregate;
using BusinessObject.Interfaces;
using DataAccess.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductApp.DTOs;
using ProductApp.Extensions;

namespace ProductApp.Controllers;

public class OrdersController(ICartService cartService, IUnitOfWork unit) : BaseApiController
{
    [HttpPost("Order")]
    public async Task<ActionResult<Order>> CreateOrder(CreateOrderDTOs orderDTOs)
    {
        var email = User.GetEmail();
        var cart = await cartService.GetCartAsync(orderDTOs.CardId);
        if (cart == null) return BadRequest("Cart not found");
        if (cart.PaymentIntentId == null) return BadRequest("No payment inten for this order");

        var items = new List<OrderItem>();
        foreach (var item in cart.Items)
        {
            var productItem = await unit.Repository<Product>().GetByIdAsync(item.ProductId);
            if (productItem == null) return BadRequest("Not found product");
            var itemOrdered = new ProductItemOrdered
            {
                ProductId = item.ProductId,
                ProductName = item.ProductName,
                PictureUrl = item.PictureUrl
            };

            var orderItem = new OrderItem
            {
                ItemOrdered = itemOrdered,
                Price = item.Price,
                Quantity = item.Quantity,
            };

            items.Add(orderItem);
        }

        var deliveryMethod = await unit.Repository<DeliveryMethod>().GetByIdAsync(orderDTOs.DeliveryMethodId);
        if (deliveryMethod == null) return BadRequest("No delivery method selected");

        var order = new Order
        {
            OrderItems = items,
            DeliveryMethod = deliveryMethod,
            ShippingAddress = orderDTOs.ShippingAddress,
            Subtotal = items.Sum(x => x.Price * x.Quantity),
            PaymentSummary = orderDTOs.PaymentSummary,
            PaymentIntentId = cart.PaymentIntentId,
            BuyerEmail = email,
            Status = OrderStatus.Pending
        };

        unit.Repository<Order>().Create(order);
        if (await unit.Complete())
        {
            return order;
        }
        return BadRequest("Problem creating order");
    }
    [HttpGet]
    public async Task<ActionResult> GetOrdersForUser()
    {
        var spec = new OrderSpecification(User.GetEmail());

        var orders = await unit.Repository<Order>().ListAsync(spec);

        return Ok(orders);
    }

    [HttpGet("getbyid")]
    
    public async Task<ActionResult<Order>> GetOrderById(int id)
    {
        var spec = new OrderSpecification(User.GetEmail(), id);

        var order = await unit.Repository<Order>().GetEntityWithSpec(spec);

        if (order == null) return NotFound();

        return order;
    }
}

using BusinessObject.Entities.OrderAddregate;
using BusinessObject.Entities;

namespace ProductApp.DTOs
{
    public class OrderDTOs
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public required string BuyerEmail { get; set; }
        public required ShippingAddress ShippingAddress { get; set; } 
        public required string DeliveryMethod { get; set; } 
        public decimal ShipppingPrice { get; set; } 
        public required PaymentSummary PaymentSummary { get; set; } 
        public List<OrderItemDTOs> OrderItems { get; set; } = [];
        public decimal Subtotal { get; set; }
        public required string Status { get; set; }
        public decimal Total { get; set; } 
        public required string PaymentIntentId { get; set; }
    }
}

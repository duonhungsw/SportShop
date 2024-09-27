using BusinessObject.Entities.OrderAddregate;
using System.ComponentModel.DataAnnotations;

namespace ProductApp.DTOs
{
    public class CreateOrderDTOs
    {
        [Required]
        public string CardId { get; set; } 
        [Required]
        public int DeliveryMethodId { get; set; }
        [Required]
        public ShippingAddress ShippingAddress { get; set; } = null!;
        [Required]
        public PaymentSummary PaymentSummary { get; set; } = null!;
    }
}

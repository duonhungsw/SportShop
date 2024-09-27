using BusinessObject.Entities.OrderAddregate;

namespace DataAccess.Specifications;

public class OrderSpecification : BaseSpecification<Order>
{
    public OrderSpecification(string email) : base(x => x.BuyerEmail == email)
    {
        AddInclude(x => x.OrderItems);
             
        AddInclude(x => x.DeliveryMethod);
        AddInclude(x => x.ShippingAddress);
        AddInclude(x => x.PaymentSummary);
        
        AddOrderByDescending(x => x.OrderDate);
    }
    public OrderSpecification(string email, int id) : base(x => x.BuyerEmail == email && x.Id == id)
    {
        AddInclude("OrderItems");
        AddInclude("DeliveryMethod");
        AddInclude("ShippingAddress");
        AddInclude("PaymentSummary");
    }
}

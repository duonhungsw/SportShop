
namespace BusinessObject.Entities.OrderAddregate;

public class ProductItemOrdered: BaseEntity
{
    
    public int ProductId { get; set; }
    public required string ProductName { get; set; }
    public required string PictureUrl { get; set; }
}

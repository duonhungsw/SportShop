namespace ProductApp.DTOs
{
    public class OrderItemDTOs
    {
        public int ProdcutId { get; set; }
        public required string ProductName { get; set; }
        public required string PictureUrl { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}

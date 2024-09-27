using System.ComponentModel.DataAnnotations;

namespace ProductApp.DTOs
{
    public class CreateProductDTO
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string? Description { get; set; } = string.Empty;
        [Range(0.1, double.MaxValue, ErrorMessage = "Price must be greater than 0.1")]
        public decimal Price { get; set; }
        [Required]
        public string PictureUrl { get; set; } = string.Empty;
        [Required]
        public string Type { get; set; } = string.Empty;
        [Required]
        public string Brand { get; set; } = string.Empty;
        [Range(0, int.MaxValue, ErrorMessage ="Quantity in stock must be greater at least 1")]
        public int QuantityInStock { get; set; }
    }
}

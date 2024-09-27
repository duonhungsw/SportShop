using System.ComponentModel.DataAnnotations;

namespace ProductApp.DTOs
{
    public class RegisterDTOs
    {
        [Required]
        public string FirstName  { get; set; } = string.Empty;
        [Required]
        public string LastName { get; set; } = string.Empty;
        [Required]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;

    }
}

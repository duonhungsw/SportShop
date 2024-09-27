using Microsoft.AspNetCore.Identity;

namespace BusinessObject.Entities;

public class User : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public Address? Address { get; set; }
}

using BusinessObject.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using System.Security.Authentication;
using System.Security.Claims;

namespace ProductApp.Extensions
{
    public static class ClaimsPrincipleExtensions
    {
        public static async Task<User> GetUserByEmail( this UserManager<User> manager, ClaimsPrincipal user)
        {
           var EmailToReturn = await manager.Users.FirstOrDefaultAsync(x => x.Email == user.GetEmail());

            if (EmailToReturn == null) throw new AuthenticationException("User not found");
            return EmailToReturn;
        }
        public static async Task<User> GetUserByEmailWithAddress(this UserManager<User> manager, ClaimsPrincipal user)
        {
            var EmailToReturn = await manager.Users.Include(x=> x.Address)
                .FirstOrDefaultAsync(x => x.Email == user.GetEmail());

            if (EmailToReturn == null) throw new AuthenticationException("User not found");
            return EmailToReturn;
        }
        public static string GetEmail(this ClaimsPrincipal user)
        {
            var email = user.FindFirstValue(ClaimTypes.Email) ?? throw new AuthenticationException("Email claim not found");
            return email;

        }
    }
}
using BusinessObject.Entities;
using Microsoft.AspNetCore.Identity;
using System.Reflection;
using System.Text.Json;

namespace DataAccess.Data
{
    public class StoreContextSeed
    {
        public static async Task SeedAsync(AppDbContext dbContext, UserManager<User> userManager)
        {
            if(!userManager.Users.Any(x => x.UserName == "admin@test.com"))
                {
                var user = new User
                {
                    UserName = "admin@test.com",
                    Email = "admin@test.com"
                };

                await userManager.CreateAsync(user, "Duonghung123@");
                await userManager.AddToRoleAsync(user,"admin");
            }
            var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

            if (!dbContext.Products.Any())
            {
                var productData = await File.ReadAllTextAsync(path+ @"/Data/SeedData/products.json");

                var product = JsonSerializer.Deserialize<List<Product>>(productData);

                if (product == null) return;
                dbContext.Products.AddRange(product);
                await dbContext.SaveChangesAsync();
            }
            if (!dbContext.DeliveryMethods.Any())
            {
                var dlData = await File.ReadAllTextAsync(path+@"/Data/SeedData/delivery.json");

                var delivery = JsonSerializer.Deserialize<List<DeliveryMethod>>(dlData);

                if (delivery == null) return;
                dbContext.DeliveryMethods.AddRange(delivery);
                await dbContext.SaveChangesAsync();
            }
        }
    }
}   

using BusinessObject.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.DAO;

public class ProductDAO : SingletonBase<ProductDAO>
{
    public void CreateAsync(Product entity)
    {
        appDbContext.Products.Add(entity);
    }

    public void DeleteAsync(Product product)
    {
        appDbContext.Products.Remove(product);
    }

    public async Task<IReadOnlyList<Product>> GetAllAsync(string? brand, string? type, string? sort)
    {
      var query = appDbContext.Products.AsQueryable();
        if(!string.IsNullOrWhiteSpace(brand)) query = query.Where(b => b.Brand == brand);
        if(!string.IsNullOrWhiteSpace(type)) query = query.Where(b => b.Type == type);

        query = sort switch
        {
            "priceAsc" => query.OrderBy(b => b.Price),
            "priceDesc" => query.OrderByDescending(b => b.Price),
            _ => query.OrderBy(b => b.Name)
        };

        return await query.ToListAsync();

    }

    public async Task<Product?> GetByIdAsync(int id)
    {
        var product = await appDbContext.Products.FirstOrDefaultAsync(x => x.Id == id);
        return product;
    }

    public void UpdateAsync(Product entity)
    {
        appDbContext.Entry(entity).State = EntityState.Modified;
    }
    public bool ProductExist(int id)
    {
        return appDbContext.Products.Any(x => x.Id == id);
    }

    public async Task<bool> SaveChangeAysnc()
    {
        return await appDbContext.SaveChangesAsync() > 0;
    }
    public async Task<IReadOnlyList<string>> GetBrandsAsync()
    {
        return await appDbContext.Products.Select(x => x.Brand).Distinct().ToListAsync();
    }
    public async Task<IReadOnlyList<string>> GetTypessAsync()
    {
        return await appDbContext.Products.Select(x => x.Type).Distinct().ToListAsync();
    }
}

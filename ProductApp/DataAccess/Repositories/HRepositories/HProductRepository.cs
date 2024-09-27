//using BusinessObject.Models;
//using DataAccess.DAO;
//using DataAccess.Repositories.IRepositories;

//namespace DataAccess.Repositories.HRepositories;

//public class HProductRepository : IProductRepository
//{
//    public void Create(Product product) => ProductDAO.Instance.CreateAsync(product);
//    public void Delete(Product product) => ProductDAO.Instance.DeleteAsync(product);

//    public async Task<IReadOnlyList<Product>> GetAllAsync(string? brand, string? type, string? sort) => await ProductDAO.Instance.GetAllAsync(brand, type, sort);

//    public async Task<Product> GetByIdAsync(int id) => await ProductDAO.Instance.GetByIdAsync(id);

//    public void Update(Product product) => ProductDAO.Instance.UpdateAsync(product);
//    public bool ProductExist(int id) => ProductDAO.Instance.ProductExist(id);
//    public async Task<bool> SaveChangeAsync() => await ProductDAO.Instance.SaveChangeAysnc();

//    public async Task<IReadOnlyList<string>> GetBrandsAsync() => await ProductDAO.Instance.GetBrandsAsync();

//    public async Task<IReadOnlyList<string>> GetTypesAsync() => await ProductDAO.Instance.GetTypessAsync();
//}

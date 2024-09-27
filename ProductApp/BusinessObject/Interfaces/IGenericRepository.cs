using BusinessObject.Entities;

namespace BusinessObject.Interfaces;

public interface IGenericRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(int id);
    Task<IReadOnlyList<T>> GetAllAsync();
    Task<T?> GetEntityWithSpec(ISpecification<T> spec);
    Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec);
    Task<TResult?> GetEntityWithSpec<TResult>(ISpecification<T, TResult> spec);
    Task<IReadOnlyList<TResult>> ListAsync<TResult>(ISpecification<T, TResult> spec);
    void Delete(T entity);
    void Create(T entity);
    void Update(T entity);
    //Task<bool> SaveAllAsync();
    bool Exist(int id);
    Task<int> CountAsync(ISpecification<T> spec);
}

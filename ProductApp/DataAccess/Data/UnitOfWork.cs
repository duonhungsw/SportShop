using BusinessObject.Interfaces;
using BusinessObject.Entities;
using System.Collections.Concurrent;
using DataAccess.Repositories.HRepositories;

namespace DataAccess.Data;

public class UnitOfWork(AppDbContext appDbContext) : IUnitOfWork
{
    private readonly ConcurrentDictionary<string, object> _repository = new();
    public async Task<bool> Complete()
    {
        return await appDbContext.SaveChangesAsync() > 0;
    }
    // giải phóng tài nguyên khi không sử dụng appDbContext
    public void Dispose()
    {
        appDbContext.Dispose();
    }

    public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
    {
        var type = typeof(TEntity).Name;

        return (IGenericRepository<TEntity>)_repository.GetOrAdd(type, t =>
        {
            var repositoryType = typeof(GenericRepository<>).MakeGenericType(typeof(TEntity));
            return Activator.CreateInstance(repositoryType, appDbContext)
            ?? throw new InvalidOperationException(
                $"Could not create repository instance for {t}");
        });
    }
}

using BusinessObject.Entities;

namespace BusinessObject.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity;

        Task<bool> Complete();
    }
}

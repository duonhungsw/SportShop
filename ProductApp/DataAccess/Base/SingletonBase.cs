using DataAccess.Data;

public class SingletonBase<T> where T : class, new()
{
    private static T instance;
    private static readonly object _lock = new object();
    public static AppDbContext appDbContext = new AppDbContext();

    public static T Instance
    {
        get
        {
            lock (_lock)
            {
                if (instance == null)
                {
                    instance = new T();
                }
                return instance;
            }
        }
    }
}

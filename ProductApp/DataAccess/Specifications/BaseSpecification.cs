using BusinessObject.Interfaces;
using System.Linq.Expressions;

namespace DataAccess.Specifications;

// lớp triển khai nếu như bất kì trường hợp filter

public class BaseSpecification<T> : ISpecification<T>
{
    // Trường để lưu tiêu chí lọc
    private readonly Expression<Func<T, bool>>? _criteria;

    // Constructor chính nhận tiêu chí lọc
    public BaseSpecification(Expression<Func<T, bool>>? criteria)
    {
        _criteria = criteria;
    }

    // Constructor mặc định gọi với null nếu cần thiết
    protected BaseSpecification() : this(null) { }
    public Expression<Func<T, bool>>? Criteria => _criteria;
    public Expression<Func<T, object>>? OrderBy { get; private set; } 
    public Expression<Func<T, object>>? OrderByDescending { get; private set; }


    public bool IsDistinct { get; private set; }

    public int Take { get; private set; }

    public int Skip { get; private set; }

    public bool IsPagingEnabled { get; private set; }
    public bool IsSearch { get; private set; }

    public List<Expression<Func<T, object>>> Includes { get; } = [];

    public List<string> IncludeString { get; } = [];

    public IQueryable<T> ApplyCriteria(IQueryable<T> query)
    {
        if(Criteria != null)
        {
            query = query.Where(Criteria);
        }
        return query;
    }

    protected void AddInclude(Expression<Func<T, object>>? include)
    {
        Includes.Add(include);
    }
    protected void AddInclude(string includeStrings)
    {
        IncludeString.Add(includeStrings); //for thenInclude
    }


    protected void AddOrderBy(Expression<Func<T, object>> orderByExpression)
    {
        OrderBy = orderByExpression;
    }
    protected void AddOrderByDescending(Expression<Func<T, object>> orderByDescExpression)
    {
        OrderByDescending = orderByDescExpression;
    }
    
    protected void ApplyDistinct()
    {
        IsDistinct = true;
    }

    protected void ApplyPaging(int skip, int take)
    {
        Skip = skip;
        Take = take;
        IsPagingEnabled = true;
    }

    
}
public class BaseSpecification<T, TResult> : BaseSpecification<T>, ISpecification<T, TResult>
{
    // Constructor nhận vào biểu thức criteria từ lớp cơ sở
    public BaseSpecification(Expression<Func<T, bool>> criteria) : base(criteria) { }

    // Constructor mặc định, có thể truyền giá trị hợp lệ nếu cần thiết
    protected BaseSpecification() : this(_ => true) { } // Đảm bảo một biểu thức hợp lệ được truyền vào

    // Thuộc tính Select cho phép chọn một giá trị cụ thể từ đối tượng T
    public Expression<Func<T, TResult>>? Select { get; private set; }

    // Phương thức thêm Select Expression
    protected void AddSelect(Expression<Func<T, TResult>> selectExpression)
    {
        Select = selectExpression;
    }
}
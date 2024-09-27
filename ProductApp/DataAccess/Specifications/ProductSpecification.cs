using BusinessObject.Entities;
using Microsoft.IdentityModel.Tokens;

namespace DataAccess.Specifications;

public class ProductSpecification : BaseSpecification<Product>
{
    public ProductSpecification(ProductSpecParams specParams) : base(x =>
        (!specParams.priceMin.HasValue || x.Price >= specParams.priceMin) &&
        (!specParams.priceMax.HasValue || x.Price <= specParams.priceMax) &&
        (specParams.Search.IsNullOrEmpty() || x.Name.ToLower().Contains(specParams.Search)) &&
        (specParams.Brands.Count == 0 || specParams.Brands.Contains(x.Brand)) &&
        (specParams.Types.Count == 0 || specParams.Types.Contains(x.Type))
    )
    {
        //ApplyPaging(specParams.PageSize * (specParams.PageSize - 1), specParams.PageSize);
        if (specParams.PageSize > 0)
        {
            ApplyPaging(specParams.PageSize * (specParams.PageIndex - 1), specParams.PageSize);
        }
        switch (specParams.Sort)
        {
            case "priceAsc":
                AddOrderBy(x => x.Price);

                break;
            case "priceDesc":
                AddOrderByDescending(x => x.Price);
                break;
            default:
                AddOrderBy(x => x.Name);
                break;
        }
        
    }
}

using BusinessObject.Entities;
using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;

namespace ProductOData
{
    public class EdmModelBuilder
    {
        public static IEdmModel GetEdmModel()
        {
            var modelBuilder = new ODataConventionModelBuilder();
            modelBuilder.EntitySet<Product>("Prodcuts");
            return modelBuilder.GetEdmModel();
        }
    }
}

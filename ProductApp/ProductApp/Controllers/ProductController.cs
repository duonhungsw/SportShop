using BusinessObject.Entities;
using BusinessObject.Interfaces;
using DataAccess.Specifications;
using Microsoft.AspNetCore.Mvc;
using ProductApp.RequestHelpers;

namespace ProductApp.Controllers;

public class ProductController(IUnitOfWork unit) : BaseApiController
{
    [Cache(600)]
    [HttpGet("GetAll")]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetAllProduct([FromQuery] ProductSpecParams specParams)
    {

        var spec = new ProductSpecification(specParams);

        return await CreatePagedResult<Product>(unit.Repository<Product>(), spec, specParams.PageIndex, specParams.PageSize);
    }
    [Cache(600)]

    [HttpGet("GetById")]
    public async Task<ActionResult<Product?>> GetById(int id)
    {
        return await unit.Repository<Product>().GetByIdAsync(id);
    }
    [Cache(10000)]

    [HttpGet("GetBrands")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetBrands()
    {
        var spec = new BrandListSpecification();

        return Ok(await unit.Repository<Product>().ListAsync(spec));
    }
    [Cache(10000)]

    [HttpGet("GetTypes")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetTypes()
    {
        var spec = new TypeListSpecification();

        return Ok(await unit.Repository<Product>().ListAsync(spec));
    }
    [InvalidateCache("api/product|")]
    [HttpPost("CreateProduct")]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        unit.Repository<Product>().Create(product);
        if (await unit.Complete())
        {
            return CreatedAtAction("GetAction", new { id = product.Id }, product);
        }
        return BadRequest("Problem creating product");
    }
    [InvalidateCache("api/product|")]

    [HttpDelete("DeleteProduct")]
    public async Task<ActionResult> DeleteProduct([FromQuery] int id)
    {
        var product = await unit.Repository<Product>().GetByIdAsync(id);
        if (product == null) return NotFound();

        unit.Repository<Product>().Delete(product);

        if (await unit.Complete())
        {
            return NoContent();
        }

        return BadRequest("Problem deleting product");
    }
    [InvalidateCache("api/product|")]

    [HttpPut("UpdateProduct")]
    public async Task<ActionResult> UpdateProduct(int id, Product product)
    {
        if (product.Id != id || ProductExists(id))
            return BadRequest("Cannot update this product");

        unit.Repository<Product>().Update(product);
        if (await unit.Complete())
        {
            return NoContent();
        }
        return BadRequest("Problem updating product");
    }

    private bool ProductExists(int id)
    {
        return unit.Repository<Product>().Exist(id);
    }
}


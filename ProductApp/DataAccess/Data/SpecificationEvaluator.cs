﻿using BusinessObject.Interfaces;
using BusinessObject.Entities;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Data;

public class SpecificationEvaluator<T> where T : BaseEntity
{
    public static IQueryable<T> GetQuery(IQueryable<T> query, ISpecification<T> spec)
    {
        if (spec != null)
        {
            query = query.Where(spec.Criteria); // b => b.Brand == brand   
        }
        if (spec.OrderBy != null)
        {
            query = query.OrderBy(spec.OrderBy);
        }
        if(spec.OrderByDescending != null)
        {
            query = query.OrderByDescending(spec.OrderByDescending);    
        }

        if(spec.IsDistinct)
        {
            query = query.Distinct();
        }

        if (spec.IsPagingEnabled)
        {
            query = query.Skip(spec.Skip).Take(spec.Take);
        }

        query = spec.Includes.Aggregate(query,(current, include) => current.Include(include));
        query = spec.IncludeString.Aggregate(query,(current, include) => current.Include(include));

        return query;
    }

    public static IQueryable<TResult>  GetQuery<TSpec, TResult>(IQueryable<T> query, ISpecification<T, TResult> spec)
    {
        if (spec != null)
        {
            query = query.Where(spec.Criteria); // b => b.Brand == brand   
        }
        if (spec.OrderBy != null)
        {
            query = query.OrderBy(spec.OrderBy);
        }
        if (spec.OrderByDescending != null)
        {
            query = query.OrderByDescending(spec.OrderByDescending);
        }

        var selectQuery = query as IQueryable<TResult>;
        if (spec.Select != null)
        {
            selectQuery = query.Select(spec.Select);
        }

        if(spec.IsDistinct)
        {
            selectQuery = selectQuery?.Distinct();
        }

        if (spec.IsPagingEnabled)
        {
            selectQuery = selectQuery?.Skip(spec.Skip).Take(spec.Take);
        }

        return selectQuery ?? query.Cast<TResult>();
    }
}

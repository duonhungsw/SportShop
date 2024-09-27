import { join } from 'node:path';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination } from '../../../share/models/pagination';
import { Product } from '../../../share/models/product';
import { response } from 'express';
import { ShopParams } from '../../../share/models/shopParam';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  constructor(private http: HttpClient) { }
  baseUrl = environment.apiUrl
  types: string[]= [];
  brands: string[] =  [];
  getProduct(shopParams: ShopParams ) {
    let params = new HttpParams();
    if(shopParams.brands.length > 0) {
      params = params.append('brands', shopParams.brands.join(','));
    }

    if(shopParams.types.length > 0) {
      params = params.append('types', shopParams.types.join(','));
    }
    if(shopParams.sort){
      params = params.append('sort', shopParams.sort);
    }
    if(shopParams.search){
      params = params.append('search', shopParams.search);
    }

    params = params.append('pageSize', shopParams.pageSize);
    params = params.append('pageIndex', shopParams.pageNumber);

    return this.http.get<Pagination<Product>>(this.baseUrl + 'Product/GetAll', {params})
  }

  getProductDetail(id: number) {
    return this.http.get<Product>(`${this.baseUrl}Product/GetById/?id=${id}`);

  }

  getBrands(){
    if(this.types.length > 0) return;
    return this.http.get<string[]>(this.baseUrl + "Product/GetBrands").subscribe({
      next: response =>this.types = response
    })
  }

  getTypes(){
    if(this.brands.length > 0) return;
     return this.http.get<string[]>(this.baseUrl + "Product/GetTypes").subscribe({
      next: response => this.brands = response
     })
  }
}

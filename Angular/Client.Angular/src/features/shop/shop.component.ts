import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../core/core/services/shop.service';
import { Product } from '../../share/models/product';
import { MatCardModule } from '@angular/material/card';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductItemComponent } from "./product-item/product-item.component";
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { ShopParams } from '../../share/models/shopParam';
import { Pagination } from '../../share/models/pagination';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule,MatCardModule, HttpClientModule, 
    ProductItemComponent, MatButton, MatIcon,
    MatMenu, MatSelectionList,MatListOption, MatMenuTrigger, MatPaginator, FormsModule
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
  providers: [HttpClient]
})
export class ShopComponent implements OnInit {
  private shopService = inject(ShopService);
  private dialogService = inject(MatDialog);
  title = 'duonhungsw';
  products?: Pagination<Product>;

  sortOption = [
    {name: 'Alphabelical', value: 'name'},
    {name: 'Price: Low-High', value: 'priceAsc'},
    {name: 'Price: High-Low', value: 'priceDesc'}
  ]
  shopParams = new ShopParams();
  pageSizeOptions = [5,10,15,20];

  ngOnInit(): void {
    this.initilizeShop();
  }

  initilizeShop() {
    this.shopService.getTypes();
    this.shopService.getBrands();
    this.getProduct();
  }

  getProduct(){
    this.shopService.getProduct(this.shopParams).subscribe({
      next: response => this.products = response,  
      error: error => console.error(error),
    })
  }

  onSortChange(event: MatSelectionListChange){
    const selectedOption = event.options[0];
    if(selectedOption) {
      this.shopParams.sort = selectedOption.value;
      this.shopParams.pageNumber = 1;
      this.getProduct();
    }
  }

  onSearchChange(){
      this,this.shopParams.pageNumber = 1;
      this.getProduct();
  }

  trackByProductId(index: number, product: Product): number {
    return product.id; // Hoặc bất kỳ thuộc tính nào là duy nhất cho mỗi product.
  }
  openFilterDialog(){
    const dialogRef = this.dialogService.open(FiltersDialogComponent,{
      minWidth: '500px',
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.brands,
      }
    });
    dialogRef.afterClosed().subscribe({
      next: result => {
        if(result) {
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;
          this.shopParams.pageNumber = 1;
          //apply filter

          this.getProduct();
        }
      }
    })
    
  }

  handlePageEvent(event: PageEvent){
    this.shopParams.pageNumber = event.pageIndex+1;
    this.shopParams.pageSize = event.pageSize;
    this.getProduct();
  }
}

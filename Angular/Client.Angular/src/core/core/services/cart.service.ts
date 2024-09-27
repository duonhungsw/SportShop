import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment.development';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Cart, CartItem } from '../../../share/models/cart';
import { Product } from '../../../share/models/product';
import { map } from 'rxjs';
import { DeliveryMethod } from '../../../share/models/deliveryMethod';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  cart = signal<Cart | null>(null);
  itemCount = computed( () => {
    return this.cart()?.items.reduce((sum, item) => sum + item.quantity, 0);
  });

  selectedDelivery = signal<DeliveryMethod | null>(null);
  totals = computed(() =>{
    const cart = this.cart();
    const delivery = this.selectedDelivery();
    if(!cart) return null;
    const subtotal = cart.items.reduce((sum,item) => sum + item.price * item.quantity, 0);
    const shipping = delivery ? delivery.price : 0;
    const discount = 0;
    return {
      subtotal,
      shipping,
      discount,
      total : subtotal + shipping - discount
    }
  })


  getCart(id: string) {
    console.log(id);
    return this.http.get<Cart>(this.baseUrl + "Cart/GetCartById?id=" + id).pipe(
      map(cart => {
        this.cart.set(cart);
        return cart;
      })
    )
  }

  setCart(cart: Cart) {
    return this.http.post<Cart>(this.baseUrl + "Cart/UpdateCart", cart).subscribe({
      next: cart => this.cart.set(cart)
    })
  }

  addToCart(item: CartItem | Product, quantity = 1) {
    const cart = this.cart() ?? this.createCart();
    if (this.isProduct(item)) {
      item = this.mapProductToCartItem(item);
    }
    cart.items = this.addOrUpdateItem(cart.items, item, quantity);
    this.setCart(cart);
  }

  removeItemFromCart(productId: number, quantity = 1){
    const cart = this.cart();
    if(!cart) return;
    const index = cart.items.findIndex(x => x.productId === productId);
    if(index !== 1){
      if(cart.items[index].quantity > quantity){
        cart.items[index].quantity -= quantity;
      }else{
        cart.items.splice(index,1);
      }
      if(cart.items.length === 0){
        this.deleteCart();
      }else{
        this.setCart(cart);
      }
    }
    }
  deleteCart() {
    this.http.delete(this.baseUrl + 'Cart/DeleteCart?id=' + this.cart()?.id).subscribe({
      next: () =>{
        localStorage.removeItem('cart_id');
        this.cart.set(null);
      }
    })
  }
  
  private addOrUpdateItem(items: CartItem[], item: CartItem, quantity: number): CartItem[] {
    const index = items.findIndex(x => x.productId === item.productId);
    if (index === -1) {
      item.quantity = quantity;
      items.push(item);
    } else {
      items[index].quantity += quantity
    }
    return items;
  }

  private mapProductToCartItem(item: Product): CartItem {
    return {
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.brand,
      type: item.type
    }
  }

  private isProduct(item: CartItem | Product): item is Product {
    //ép kiểu item thành product
    return (item as Product).id !== undefined;
  }

  createCart(): Cart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id);
    return cart;
  }

  constructor() { }
}

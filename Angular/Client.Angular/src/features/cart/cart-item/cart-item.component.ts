import { Component, inject, input } from '@angular/core';
import { Cart, CartItem } from '../../../share/models/cart';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/core/services/cart.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButton,
    MatIcon,
    CurrencyPipe
  ],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  item = input.required<CartItem>();
  cartService = inject(CartService);

  incrementQuantity(){
    this.cartService.addToCart(this.item());
  }
  decrmentQuantity(){
    this.cartService.removeItemFromCart(this.item().productId);
  }
  removeItemForCart(){
    this.cartService.removeItemFromCart(this.item().productId, this.item().quantity);
  }
}

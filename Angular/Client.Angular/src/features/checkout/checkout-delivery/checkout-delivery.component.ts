import { Component, inject, OnInit, output } from '@angular/core';
import { CheckoutService } from '../../../core/core/services/checkout.service';
import {MatRadioModule} from '@angular/material/radio';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/core/services/cart.service';
import { DeliveryMethod } from '../../../share/models/deliveryMethod';

@Component({
  selector: 'app-checkout-delivery',
  standalone: true,
  imports: [
    MatRadioModule,
    CurrencyPipe
  ],
  templateUrl: './checkout-delivery.component.html',
  styleUrl: './checkout-delivery.component.scss'
})
export class CheckoutDeliveryComponent implements OnInit {
  checkoutService = inject(CheckoutService);
  cartSevice = inject(CartService);
  deliveryComplete = output<boolean>();

  ngOnInit(): void {
    this.checkoutService.getDeliveryMethod().subscribe({
      next: methods =>{
        if(this.cartSevice.cart()?.deliveryMethodId){
          const method = methods.find(x => x.id === this.cartSevice.cart()?.deliveryMethodId);
          if(method){
            this.cartSevice.selectedDelivery.set(method);
            this.deliveryComplete.emit(true);
          }
        }
      }
    });

   
  }
  updateDeliveryMethod(method: DeliveryMethod){
    this.cartSevice.selectedDelivery.set(method);
    const cart = this.cartSevice.cart();
    if(cart){
      cart.deliveryMethodId = method.id;
      this.cartSevice.setCart(cart);
      this.deliveryComplete.emit(true);
    }
  }
}

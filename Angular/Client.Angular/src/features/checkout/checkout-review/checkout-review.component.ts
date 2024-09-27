import { ConfirmationToken } from '@stripe/stripe-js';
import { Component, inject, Input } from '@angular/core';
import { CartService } from '../../../core/core/services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { AddressPipe } from "../../../share/pipes/address.pipe";
import { PaymentCardPipe } from "../../../share/pipes/payment-card.pipe";

@Component({
  selector: 'app-checkout-review',
  standalone: true,
  imports: [
    CurrencyPipe,
    AddressPipe,
    PaymentCardPipe
],
  templateUrl: './checkout-review.component.html',
  styleUrl: './checkout-review.component.scss'
})
export class CheckoutReviewComponent {
  cartService = inject(CartService);
  @Input() confirmationToken?: ConfirmationToken;
}

import { Address } from './../../share/models/account';
import { Order, OrderToCreate } from './../../share/models/order';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { OrderSummaryComponent } from "../../share/components/order-summary/order-summary.component";
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { StripeService } from '../../core/core/services/stripe.service';
import { ConfirmationToken, StripeAddressElement, StripeAddressElementChangeEvent, StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import { SnackbarService } from '../../core/core/services/snackbar.service';
import { AccountService } from '../../core/core/services/account.service';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { catchError, firstValueFrom, from, last, map, Observable, of } from 'rxjs';
import { CheckoutDeliveryComponent } from "./checkout-delivery/checkout-delivery.component";
import { CheckoutReviewComponent } from "./checkout-review/checkout-review.component";
import { CartService } from '../../core/core/services/cart.service';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ShippingAddress } from '../../share/models/order';
import { OrderService } from '../../core/core/services/order.service';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    OrderSummaryComponent,
    MatStepperModule,
    MatButtonModule,
    RouterLink,
    MatCheckboxModule,
    CheckoutDeliveryComponent,
    CheckoutReviewComponent,
    CurrencyPipe,
    JsonPipe,
    MatProgressSpinnerModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  private stripeService = inject(StripeService);
  private snackBar = inject(SnackbarService);
  private accountService = inject(AccountService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  cartServcie = inject(CartService);
  addressElement?: StripeAddressElement;
  paymentElement?: StripePaymentElement;

  saveAddress = false;
  completionStatus = signal<{ address: boolean, card: boolean, delivery: boolean }>(
    { address: false, card: false, delivery: false }
  )
  confirmationToken?: ConfirmationToken;
  loading = false;

  // constructor(){
  //   this.hanldeAddressChange = this.hanldeAddressChange.bind(this);
  // }

  async ngOnInit() {
    try {
      this.addressElement = await this.stripeService.createdAddressElement();
      this.addressElement.mount('#address-element');
      this.addressElement.on('change', this.hanldeAddressChange);


      this.paymentElement = await this.stripeService.createPaymentElement();
      this.paymentElement.mount('#payment-element');
      this.paymentElement.on('change', this.hanldePaymentChange)
    } catch (error: any) {
      this.snackBar.error(error.message);
    }
  }

  hanldeAddressChange = (event: StripeAddressElementChangeEvent) => {
    this.completionStatus.update(state => {
      state.address = event.complete;
      return state
    })
  }
  hanldePaymentChange = (event: StripePaymentElementChangeEvent) => {
    this.completionStatus.update(state => {
      state.card = event.complete;
      return state
    })
  }
  handleDeliveryChange(event: boolean) {
    this.completionStatus.update(state => {
      state.delivery = event;
      return state;
    })
  }

  async getConfirmationToken() {
    try {
      if (Object.values(this.completionStatus()).every(status => status === true)) {
        const result = await this.stripeService.createConfirmationToken();
        if (result.error) throw new Error(result.error.message);
        this.confirmationToken = result.confirmationToken;
        console.log(this.confirmationToken);
      }
    } catch (error: any) {
      this.snackBar.error(error.message);
    }
  }
  ngOnDestroy(): void {
    this.stripeService.disposeElements();
  }
  onSaveAddressCheckboxChange(event: MatCheckboxChange) {
    this.saveAddress = event.checked;
  }

  async onStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 1) {
      if (this.saveAddress) {
        const address = await this.getAddressFromStripeAddress() as Address;
        address && firstValueFrom(this.accountService.updateUserAddress(address));
      }
    }
    if (event.selectedIndex === 2) {
      await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent());
    }
    if (event.selectedIndex === 3) {
      await this.getConfirmationToken();
    }
  }

  confirmPayment(stepper: MatStepper) {
    if (this.confirmationToken) {
      this.stripeService.confirmPayment(this.confirmationToken).subscribe({
        next: (result) => {
          if (result.paymentIntent?.status === "succeeded") {
            this.createOrderModel().subscribe({
              next: (order) => {
                const cart = this.cartServcie.cart();
                const cartId = cart?.id ? cart.id.toString() : ''; 

                // const ordered: OrderToCreate = {
                //   CardId: cartId,
                //   deliveryMethodId: 4,
                //   shippingAddress: {
                //     id: 0,
                //     name: "hung",
                //     line1: "Han mac tu",
                //     line2: "null",
                //     city: "Da Nang",
                //     state: "Ny",
                //     postalCode: "123",
                //     country: "Viet Name"
                //   },
                //   paymentSummary: {
                //     id: 0,
                //     last4: +"4444",
                //     brand: "Mastercard",
                //     expMonth: 12,
                //     expYear: 2024
                //   }
                // }
                const ordered = this.createOrderModel();
                this.http.post('http://localhost:5094/api/Orders/Order', order).subscribe({

                  // this.orderService.createOrder(order).subscribe({
                  next: (orderResult) => {
                    const order = orderResult as Order; 

                    if (order) {
                      this.cartServcie.deleteCart();
                      this.cartServcie.selectedDelivery.set(null);
                      this.router.navigateByUrl(`/checkout/success?id=${order.id}`);

                    } else {
                      this.snackBar.error('Order creation failed');
                      stepper.previous();
                    }
                  },
                  error: (error) => {
                    this.snackBar.error(error.message || 'Failed to create order');
                    stepper.previous();
                  },
                });
              },
              error: (error) => {
                this.snackBar.error(error.message || 'Failed to create order model');
                stepper.previous();
              },
            });
          } else if (result.error) {
            this.snackBar.error('error');
            stepper.previous();
          } else {
            this.snackBar.error('Something went wrong');
            stepper.previous();
          }
        },
        error: (error) => {
          this.snackBar.error(error.message || 'Payment confirmation failed');
          stepper.previous();
        },
      });
    }
  }

  private createOrderModel(): Observable<OrderToCreate> {
    const cart = this.cartServcie.cart();

    const shippingAddress: ShippingAddress = {
      name: 'hung',
      line1: 'han mac tu',
      line2: '',
      city: 'da nang',
      state: 'thuan phuoc',
      postalCode: '123123',
      country: 'VietName',
      id: 0
    };

    const card = this.confirmationToken?.payment_method_preview.card;

    if (!cart?.id || !cart.deliveryMethodId || !card || !shippingAddress) {
      throw new Error('Problem to create order');
    }

    return of({
      CardId: cart.id.toString(),
      deliveryMethodId: cart.deliveryMethodId,
      shippingAddress: shippingAddress,
      paymentSummary: {
        last4: +card.last4,
        brand: card.brand,
        expMonth: card.exp_month,
        expYear: card.exp_year,
        id: 0
      }
    });
  }

  private async getAddressFromStripeAddress(): Promise<Address | ShippingAddress | null> {
    const result = await this.addressElement?.getValue();
    const address = result?.value.address;

    if (address) {
      return {
        name: result.value.name,
        line1: address.line1,
        line2: address.line2 || undefined,
        city: address.city,
        country: address.country,
        state: address.state,
        postalCode: address.postal_code
      }
    } else return null;
  }
}

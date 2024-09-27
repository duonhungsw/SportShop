import { config } from './../../../app/app.config.server';
import { Address } from './../../../share/models/account';
import { inject, Injectable } from '@angular/core';
import { ConfirmationToken, loadStripe, PaymentIntentResult, Stripe, StripeAddressElement, StripeAddressElementOptions, StripeElement, StripeElements, StripePaymentElement } from "@stripe/stripe-js";
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CartService } from './cart.service';
import { Cart } from '../../../share/models/cart';
import { catchError, firstValueFrom, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AccountService } from './account.service';
@Injectable({
  providedIn: 'root'
})
export class StripeService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private cartService = inject(CartService);
  private accountService = inject(AccountService);
  private stripePromise: Promise<Stripe | null>;
  private elements?: StripeElements;
  private addressElement?: StripeAddressElement;
  private paymentElement?: StripePaymentElement;

  constructor() {
    this.stripePromise = loadStripe(environment.stripePublicKey);
  }

  getStripeInstance() {
    return this.stripePromise;
  }

  async initializeElement(){
    if(!this.elements){
      const stripe = await this.getStripeInstance();
      if(stripe){
        const cart = await firstValueFrom(this.createOrUpdatePaymentIntent());
        this.elements = stripe.elements({clientSecret: cart.clientSecret, appearance:{labels: 'floating'}});
      }else{
        throw new Error('Stripe has not been loaded');
      }
    }
    return this.elements;
  }

async createPaymentElement(){
  if(!this.paymentElement){
    const elements = await this.initializeElement();
    if(elements){
      this.paymentElement = elements.create('payment');
    }else{
      throw new Error('Elements instace has not been initilized');
    }
  }
  return this.paymentElement;
}

  async createdAddressElement(){
    if(!this.addressElement){
      const elements = await this.initializeElement();
      if(elements){
        const user = this.accountService.currenUser();
        let defaultsValues: StripeAddressElementOptions['defaultValues'] = {};

        if(user){
          defaultsValues.name = user.firstName + ' ' + user.lastName;
        }

        if(user?.address){
          defaultsValues.address = {
            line1 :user.address.line1,
            line2 : user.address.line2,
            city : user.address.city,
            state : user.address.state,
            country : user.address.country,
            postal_code : user.address.postalCode,
          }
        }

        const options: StripeAddressElementOptions = {
          mode:'shipping'
        };
        this.addressElement = elements.create('address', options);
      }else{
        throw new Error('Element instance has not been loaded');
      }
    }
    return this.addressElement;
  }

async createConfirmationToken(){
  const stripe = await this.getStripeInstance();
  const elements = await this.initializeElement();
  const result = await elements.submit();
  if(result.error) throw new Error(result.error.message);
  if(stripe){
    return await stripe.createConfirmationToken({elements});
  }else{
    throw new Error('Stripe not available');
  }

}

confirmPayment(confirmationToken: ConfirmationToken): Observable<PaymentIntentResult> {
  return from(this.getStripeInstance()).pipe(
    switchMap(stripe => {
      return from(this.initializeElement()).pipe(
        switchMap(elements => {
          return from(elements.submit()).pipe(
            switchMap(result => {
              if (result.error) {
                throw new Error('Error');
              }

              const clientSecret = this.cartService.cart()?.clientSecret;

              if (stripe && clientSecret) {
                return from(stripe.confirmPayment({
                  clientSecret: clientSecret,
                  confirmParams: {
                    confirmation_token: confirmationToken.id
                  },
                  redirect: 'if_required'
                })).pipe(
                  catchError(err => throwError(() => new Error(err.message)))
                );
              } else {
                return throwError(() => new Error('Unable to load Stripe or missing client secret'));
              }
            })
          );
        })
      );
    }),
    catchError(err => {
      console.error('Error in confirmPayment:', err);
      return throwError(() => new Error(err.message));
    })
  );
}

  createOrUpdatePaymentIntent(){
    const cart = this.cartService.cart();
    if(!cart) throw new Error("Problem with cart");

    return this.http.post<Cart>(this.baseUrl + "paymens/" + cart.id,{}).pipe(
      map(cart => {
        this.cartService.setCart(cart);
        return cart;
      })
    )
  }

  disposeElements(){
    this.elements = undefined;
    this.addressElement = undefined;
    this.paymentElement = undefined;
  }
}

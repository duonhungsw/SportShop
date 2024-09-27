import { inject, Injectable } from '@angular/core';
import { DeliveryMethod } from '../../../share/models/deliveryMethod';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { of } from 'rxjs';
import { map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  deliveryMethod: DeliveryMethod[] = [];

  getDeliveryMethod() {
    if (this.deliveryMethod.length > 0) return of(this.deliveryMethod);
    return this.http.get<DeliveryMethod[]>(this.baseUrl + 'Paymens/delivery-methods').pipe(
      map(methods => {
        this.deliveryMethod = methods.sort((a, b) => b.price - a.price);
        return methods;
      })
    );
  }
}

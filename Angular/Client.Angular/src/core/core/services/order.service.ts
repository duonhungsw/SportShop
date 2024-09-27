import { Order } from './../../../share/models/order';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderToCreate } from '../../../share/models/order';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

    createOrder(orderToCreate: OrderToCreate):Observable<any> {
    return this.http.post(this.baseUrl + "Orders/order", orderToCreate)
  }

  getOrdersForUser() {
    return this.http.get<Order[]>(this.baseUrl + "Orders")
  }

  getOrderDetail(id: number) {
    return this.http.get<Order>(this.baseUrl + "Orders/getbyid?id=" + id)
  }
}

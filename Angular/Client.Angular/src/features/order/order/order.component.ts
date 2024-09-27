import { tap } from 'rxjs';
import { OrderService } from './../../../core/core/services/order.service';
import { Component, inject, OnInit } from '@angular/core';
import { Order } from '../../../share/models/order';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [RouterLink,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {

  private orderService = inject(OrderService);
  public orders: any;
  ngOnInit(): void {
    this.getOrdersForUser();
  }
  getOrdersForUser() {
    this.orderService.getOrdersForUser().pipe(
      tap(data => {
        this.orders = data
        console.log(data)
      })
    ).subscribe();
  }

}

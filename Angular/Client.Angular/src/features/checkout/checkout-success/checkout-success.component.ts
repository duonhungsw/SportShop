import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { OrderService } from '../../../core/core/services/order.service';
import { tap } from 'rxjs';
import { AddressPipe } from "../../../share/pipes/address.pipe";
import { PaymentCardPipe } from "../../../share/pipes/payment-card.pipe";

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [
    MatButton,
    RouterLink,
    MatProgressSpinnerModule,
    DatePipe,
    CurrencyPipe,
    AddressPipe,
    PaymentCardPipe,
    CommonModule
  ],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss'
})
export class CheckoutSuccessComponent implements OnInit {
  private router = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  public order: any;
  ngOnInit(): void {
    this.router.queryParams.subscribe(param => {
      const orderId = param['id'];
      this.getOrder(orderId);
    })
  }

  getOrder(id: number) {
    this.orderService.getOrderDetail(id).pipe(
      tap((data) => {
        this.order = data;
        console.log(data)
      })
    ).subscribe();
  }
}

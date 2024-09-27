import { AccountService } from './../../core/core/services/account.service';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';

import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BusyService } from '../../core/core/services/busy.service';
import { CartService } from '../../core/core/services/cart.service';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    RouterLink,
    RouterLinkActive,
    MatProgressBar,
    RouterLink,
    RouterLinkActive,
    MatMenu,
    MatMenuTrigger,
    MatDividerModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  busyServie = inject(BusyService);
  cartService = inject(CartService);
  accountService= inject(AccountService);
  private router = inject(Router);

  logout(){
    this.accountService.logout().subscribe({
      next : ()=>{
        this.accountService.currenUser.set(null);
        this.router.navigateByUrl('/');
      }
    })
  }
}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShopComponent } from "../features/shop/shop.component";
import { HeaderComponent } from "../layout/header/header.component";

import { NgOptimizedImage } from '@angular/common'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ShopComponent,NgOptimizedImage],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = "duonhungsw";
}

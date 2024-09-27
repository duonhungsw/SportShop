import { response } from 'express';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { error } from 'console';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-test-error',
  standalone: true,
  imports: [MatButton],
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.scss'
})
export class TestErrorComponent {
  baseUrl = environment.apiUrl;
  private http =  inject(HttpClient);
  validationErrors?: string[];

  get404Error(){
    this.http.get(this.baseUrl + "Buggy/notfound").subscribe({
      next: response => console.log(response),
      error: error => console.error(error)
    })
  }
  get400Error(){
    this.http.get(this.baseUrl + "Buggy/badrequest").subscribe({
      next: response => console.log(response),
      error: error => console.error(error)
    })
  }
  get401Error(){
    this.http.get(this.baseUrl + "Buggy/unauthorized").subscribe({
      next: response => console.log(response),
      error: error => console.error(error)
    })
  }
  get500Error(){
    this.http.get(this.baseUrl + "Buggy/internalerror").subscribe({
      next: response => console.log(response),
      error: error => console.error(error)
    })
  }
  get400ValidationError(){
    this.http.post(this.baseUrl + "Buggy/validationerror", {}).subscribe({
      next: response => console.log(response),
      error: error => this.validationErrors = error
    })
  }
}

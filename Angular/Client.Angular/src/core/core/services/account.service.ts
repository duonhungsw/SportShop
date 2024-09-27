import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Address, User } from '../../../share/models/account';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  urlLink = environment.apiUrl
  currenUser = signal<User | null>(null);

  login(values: any){
    let params = new HttpParams();
    params = params.append("useCookies", true);
    return this.http.post<User>(this.urlLink + 'login' , values, {params});
  }

  register(values: any): Observable<any>{
    return this.http.post(this.urlLink + 'account/register', values);
  } 

  logout(){
    return this.http.post(this.urlLink + 'account/logout',{});
  }

  getUserInfo(){
    return this.http.get<User>(this.urlLink + 'account/user-info').pipe(
    map(user => {
      this.currenUser.set(user);
      return user;
    })
    )
  }

  updateUserAddress(address: Address) : Observable<any>{
    return this.http.post(this.urlLink + 'account/address', address).pipe(
      tap(() => {
        this.currenUser.update(user => {
          if(user) user.address = address;
          return user;
        })
      })
    )
  }

  getAuthState(){
    return this.http.get<{isAuthenticated: boolean}>(this.urlLink +"account/auth-status");
  }
}

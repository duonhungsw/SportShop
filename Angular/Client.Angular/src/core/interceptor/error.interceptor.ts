import { error } from 'console';
import { NavigationExtras, Router } from '@angular/router';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, model } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SnackbarService } from '../core/services/snackbar.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackbar = inject(SnackbarService)
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 400) {
        if(err.error.errors){
          const modelStateErrors = [];
          for(const key in err.error.errors){
            if(err.error.errors[key]){
              modelStateErrors.push(err.error.errors[key])
            }
          }
          //ném danh sách lỗi đã thu thập
          throw modelStateErrors.flat();
        }
        else{
          snackbar.error(err.error.title || err.error)
        }
      }
      if (err.status === 401) {
        snackbar.error(err.error.title || err.error)
      }
      if (err.status === 404) {
        router.navigateByUrl('/not-found')
      }
      if (err.status === 500) {
        const navigationExtras: NavigationExtras = {state: {error: err.error}}
       router.navigateByUrl('/server-error', navigationExtras)
      }
      return throwError(() =>err)
    })
  );
};

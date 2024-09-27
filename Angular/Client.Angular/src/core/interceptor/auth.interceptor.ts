import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const closeRequest = req.clone({
      withCredentials: true
    })
  return next(closeRequest);
};

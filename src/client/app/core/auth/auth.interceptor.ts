import { Injectable } from '@angular/core';

import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { AUTH_TOKEN_KEY } from '@client/constants/auth.constants';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private readonly router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    let newRequest = req;

    if (token) {
      newRequest = req.clone({
        headers: req.headers.set('Authorization',
          'Bearer ' + token)
      });
    }

    return next.handle(newRequest)
      .catch(
        (error) => {
          if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
            this.router.navigateByUrl('/');
            return Observable.of(error.message);
          }
          return Observable.throw(error);
        }
      );

  }
}

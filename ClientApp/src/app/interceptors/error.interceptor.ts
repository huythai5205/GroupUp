import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error) {
          console.log(error);
          switch (error.status) {
            case 400:
              if (error.error.errors) {
                console.log("in");

                const modalStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modalStateErrors.push(error.error.errors[key])
                  }
                }
                throw modalStateErrors.flat();
              } else if (error.error.message) {
                this.snackBar.open(error.error.message, 'error', { duration: 3000 });
              } else if (typeof (error.error) === 'object') {
                this.snackBar.open(error.statusText, 'error', { duration: 3000 });
              } else {
                this.snackBar.open(error.error, 'error', { duration: 3000 });
              }
              break;
            case 401:
              if (typeof (error.error) === 'object') {
                this.snackBar.open(error.statusText, 'error', { duration: 3000 });
              } else {
                this.snackBar.open(error.error, 'error', { duration: 3000 });
              }
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = { state: { error: error.error } }
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              this.snackBar.open('Something unexpected went wrong', 'error', { duration: 3000 });
              break;
          }
        }
        return throwError(error);
      })
    )
  }
}

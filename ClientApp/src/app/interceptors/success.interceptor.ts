import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';

@Injectable()
export class SuccessInterceptor implements HttpInterceptor {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse && event.status == 200 && event.body.message) {
          this.snackBar.open(event.body.message, 'success', { duration: 3000 });
        }
      })
    );
  }
}

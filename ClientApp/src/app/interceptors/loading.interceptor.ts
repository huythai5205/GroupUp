import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { IsLoadingService } from '../shared/services/is-loading.service';
import { delay, finalize } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(
    private isLoadingService: IsLoadingService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.isLoadingService.loading();
    return next.handle(request).pipe(
      delay(500),
      finalize(() => this.isLoadingService.idle())
    );
  }
}

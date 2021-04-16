import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsLoadingService {
  isLoadingRequestCount = 0;
  isLoading = new BehaviorSubject<boolean>(false);

  constructor() { }

  loading(): void {
    this.isLoadingRequestCount++;
    this.isLoading.next(true);
  }

  idle(): void {
    this.isLoadingRequestCount--;
    if (this.isLoadingRequestCount <= 0) {
      this.isLoadingRequestCount = 0;
      this.isLoading.next(false);
    }
  }
}

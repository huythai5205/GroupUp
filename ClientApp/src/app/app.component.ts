import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { IsLoadingService } from './shared/services/is-loading.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'GU-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  isLoading: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private isLoadingService: IsLoadingService
  ) { }

  ngOnInit() {
    this.isLoadingService.isLoading
      .pipe(delay(0))
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
      });
  }

}

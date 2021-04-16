import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { User } from 'src/app/shared/models';
import { AccountService } from 'src/app/shared/services';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'GU-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  user: User;

  constructor(
    private router: Router,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user: User) => {
      this.user = user;
    });
  }

}


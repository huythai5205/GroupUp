import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from '../shared/services';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'GU-menu-nav',
  templateUrl: './menu-nav.component.html',
  styleUrls: ['./menu-nav.component.scss']
})

export default class MenuNavComponent implements OnInit {

  constructor(
    private router: Router,
    public accountService: AccountService
  ) { }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) this.accountService.setCurrentUser(user);
  }

  /**
   * Log user out,
   * delete database in browser,
   * then navigate user to login page.
   */
  logout = (): void => {
    this.accountService.logout();
    this.router.navigate(['/login']);
  }

}

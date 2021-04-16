import { Component } from '@angular/core';

import { AccountService } from '../../../shared/services';
import { Router } from '@angular/router';
import { IsLoadingService } from 'src/app/shared/services/is-loading.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'GU-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  isLoginError = false;
  isEmailError = false;
  hidePassword = true;
  errorMessage = '';
  rememberMe = false;

  loginApiUrl = '/api/v1/account/login';
  getUserProfileUrl = '/api/v1/profile/getUserProfile';

  constructor(
    private router: Router,
    private accountService: AccountService,
    public isLoadingService: IsLoadingService
  ) { }

  gotoDashBoard(): void {
    this.router.navigate(['/dashboard']);
  }

  login(form: any): void {
    this.accountService.login(form.email, form.password, form.rememberMe).subscribe(() => {
      this.gotoDashBoard();
    });
  }

}

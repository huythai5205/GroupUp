import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'GU-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {

  hidePassword = false;
  errorMessage = '';
  isLoading = false;
  changePasswordUrl = '/api/v1/profile/changePassword';

  constructor(
    private http: HttpClient
  ) { }

  onSubmit(form: any): void {
    this.isLoading = true;
    let changePasswordModel = {
      oldPassword: form.oldPassword,
      newPassword: form.newPassword
    }

    this.http.post<any>(environment.baseUrl + this.changePasswordUrl, changePasswordModel)
      .subscribe(result => {
        this.isLoading = false;
      }, error => {
        this.errorMessage = error;
      });

  }

}

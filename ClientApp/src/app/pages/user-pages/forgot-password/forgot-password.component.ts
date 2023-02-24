import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'GU-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordApiUrl: string = '/api/v1/account/forgotPassword';
  forgotPasswordForm: UntypedFormGroup;
  Email: UntypedFormControl;

  constructor(
    private fb: UntypedFormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.Email = new UntypedFormControl('', [Validators.required, Validators.email]);

    this.forgotPasswordForm = this.fb.group({
      Email: this.Email
    });
  }

  onSubmit(): void {
    let userInfo = this.forgotPasswordForm.value;
    this.http.post<any>(environment.baseUrl + this.forgotPasswordApiUrl + '/' + this.Email, {}).subscribe(
      (result) => {
        if (result && result.message == 'Success') {

        }
      }
    );
  }

}


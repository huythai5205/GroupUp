import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'GU-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordApiUrl: string = '/api/v1/account/forgotPassword';
  forgotPasswordForm: FormGroup;
  Email: FormControl;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.Email = new FormControl('', [Validators.required, Validators.email]);

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


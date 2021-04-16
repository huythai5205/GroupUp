import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AccountService } from 'src/app/shared/services';
import { IsLoadingService } from 'src/app/shared/services/is-loading.service';
import { matchValues } from 'src/app/shared/validations';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'GU-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {

  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  registerForm: FormGroup;
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private fb: FormBuilder,
    public isLoadingService: IsLoadingService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, matchValues('email')]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      confirmPassword: ['', [Validators.required, matchValues('password')]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      DOB: ['', Validators.required]
    });
  }

  register(): void {
    this.registerForm.controls['DOB'].setValue(JSON.stringify(this.registerForm.controls['DOB'].value).replace(/"/g, ""));
    this.accountService.register(this.registerForm.value).subscribe(response =>
      this.router.navigateByUrl('login'))
  }
}

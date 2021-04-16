import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from '../services';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private accountService: AccountService
  ) { }

  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(map(user => {
      if (user) return true;
      this.router.navigate(['/login']);
      this.snackBar.open('Please log in', 'log in', { duration: 3000 });
      return false;
    }));
  }
}


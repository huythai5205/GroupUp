import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AccountService } from './account.service';
import { Member, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  memberCache = new Map();
  user: User;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    })
  }


  getMember(memberId: string): Observable<Member> {
    const member = this.memberCache.get(Object.values(memberId).join(''));
    if (member) {
      return of(member);
    }

    return this.http.get<Member>(environment.baseUrl + 'members/' + memberId).pipe(map(member => {
      this.memberCache.set(Object.values(member.id).join(''), member);
      return member;
    }));
  }

}

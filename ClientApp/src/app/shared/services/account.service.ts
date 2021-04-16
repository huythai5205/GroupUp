import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, shareReplay } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

import { User } from '../models';

import { environment } from '../../../environments/environment';
import { PresenceService } from './presence.service';

@Injectable()
export class AccountService {

    private currentUser = new ReplaySubject<User>(1);
    currentUser$ = this.currentUser.asObservable();

    constructor(
        private http: HttpClient,
        private presence: PresenceService
    ) { }

    register = (model: any): Observable<Object> => this.http.post(environment.baseUrl + 'account/register', model);

    login = (email: String, password: String, rememberMe: Boolean): Observable<void> => {
        let user = {
            email: email,
            password: password,
            rememberMe: rememberMe
        }
        return this.http.post<User>(environment.baseUrl + 'account/login', user)
            .pipe(shareReplay(), map((user: User) => this.setCurrentUser(user)));
    }

    setCurrentUser(user: User): void {
        this.currentUser.next(user);
        localStorage.setItem('user', JSON.stringify(user));
        this.presence.createHubConnection(user);
    }

    addEvent = (userEvent: any): Observable<User> => this.http.post<User>(environment.baseUrl + 'account/addEvent', userEvent);

    logout(): void {
        localStorage.removeItem('user');
        this.currentUser.next(null);
        this.presence.stopHubConnection();
    }

}


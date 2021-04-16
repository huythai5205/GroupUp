import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  private hubConnection: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  createHubConnection(user: User): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build()

    this.hubConnection
      .start()
      .catch(error => console.log(error));

    this.hubConnection.on('UserIsOnline', userId => {
      this.onlineUsers$.pipe(take(1)).subscribe(userIds => {
        this.onlineUsersSource.next([...userIds, userId])
      })
    })

    this.hubConnection.on('UserIsOffline', userId => {
      this.onlineUsers$.pipe(take(1)).subscribe(userIds => {
        this.onlineUsersSource.next([...userIds.filter(x => x !== userId)])
      })
    })

    this.hubConnection.on('GetOnlineUsers', (userIds: string[]) => {
      this.onlineUsersSource.next(userIds);
    })

    this.hubConnection.on('NewMessageReceived', ({ memberId, firstName }) => {
      console.log(memberId);
      this.snackBar.open(firstName + ' has sent you a new message!', 'reply',)
        .onAction()
        .pipe(take(1))
        .subscribe(() => this.router.navigateByUrl('/members-detail/' + memberId));
    })
  }

  stopHubConnection(): void {
    this.hubConnection.stop().catch(error => console.log(error));
  }
}

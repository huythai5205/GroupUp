import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Group, EventMessage, PaginatedResult, User } from '../models';
import { IsLoadingService } from './is-loading.service';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class EventMessageService {
  private hubConnection: HubConnection;
  private messageThreadSource = new BehaviorSubject<EventMessage[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(
    private http: HttpClient,
    private isLoadingService: IsLoadingService
  ) { }

  createHubConnection(user: User, eventId: string): void {
    this.isLoadingService.loading();
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.hubUrl + `eventMessage?eventId=${eventId}`, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build()

    this.hubConnection.start()
      .catch(error => console.log(error))
      .finally(() => this.isLoadingService.idle());

    this.hubConnection.on('ReceiveMessageThread', messages => {
      this.messageThreadSource.next(messages);
    })

    this.hubConnection.on('NewMessage', message => {
      this.messageThread$.pipe(take(1)).subscribe(messages => {
        this.messageThreadSource.next([...messages, message])
      })
    })

    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some(x => x.userId === eventId)) {
        this.messageThread$.pipe(take(1)).subscribe(messages => {
          this.messageThreadSource.next([...messages]);
        })
      }
    })
  }

  stopHubConnection(): void {
    if (this.hubConnection) {
      this.messageThreadSource.next([]);
      this.hubConnection.stop().catch(error => console.log(error));
    }
  }

  getMessageThread = (memberId: string): Observable<EventMessage[]> => this.http.get<EventMessage[]>(environment.baseUrl + 'messages/thread/' + memberId);


  async sendMessage(memberId: string, content: string): Promise<any> {
    return this.hubConnection.invoke('SendMessage', { recipientId: memberId, content })
      .catch(error => console.log(error));
  }

  deleteMessage = (id: string): Observable<Object> => this.http.delete(environment.baseUrl + 'messages/' + id);

}

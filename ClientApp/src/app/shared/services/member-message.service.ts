import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Group, MemberMessage, PaginatedResult, User } from '../models';
import { IsLoadingService } from './is-loading.service';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MemberMessageService {
  private hubConnection: HubConnection;
  private messageThreadSource = new BehaviorSubject<MemberMessage[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(
    private http: HttpClient,
    private isLoadingService: IsLoadingService
  ) { }

  createHubConnection(user: User, otherUserId: string): void {
    this.isLoadingService.loading();
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.hubUrl + `memberMessage?memberId=${otherUserId}`, {
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
      if (group.connections.some(x => x.userId === otherUserId)) {
        this.messageThread$.pipe(take(1)).subscribe(messages => {
          messages.forEach(message => {
            if (!message.dateRead) {
              message.dateRead = new Date(Date.now())
            }
          })
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

  getMessages(pageNumber, pageSize, container): Observable<PaginatedResult<MemberMessage[]>> {
    console.log("dfsa");
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult<MemberMessage[]>(environment.baseUrl + 'memberMessages', params, this.http);
  }

  getMessageThread = (memberId: string): Observable<MemberMessage[]> => this.http.get<MemberMessage[]>(environment.baseUrl + 'memberMessages/thread/' + memberId);


  async sendMessage(memberId: string, content: string): Promise<any> {
    return this.hubConnection.invoke('SendMessage', { recipientId: memberId, content })
      .catch(error => console.log(error));
  }

  deleteMessage = (id: string): Observable<Object> => this.http.delete(environment.baseUrl + 'memberMessages/' + id);

}

import { Component, OnInit } from '@angular/core';
import { MemberMessage, Pagination } from '../../models';
import { ConfirmService, MemberMessageService } from '../../services';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  messages: MemberMessage[] = [];
  pagination: Pagination;
  container: string = 'Unread';
  pageNumber: number = 1;
  pageSize: number = 5;
  loading: boolean = false;

  constructor(
    private memberMessageService: MemberMessageService,
    private confirmService: ConfirmService
  ) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.loading = true;
    this.memberMessageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe(response => {
      console.log(response);
      this.messages = response.result;
      this.pagination = response.pagination;
      this.loading = false;
    })
  }

  deleteMessage(id: string): void {
    const data = {
      title: 'Delete Message',
      message: 'Confirm delete message. This cannot be undone',
      cancelText: 'Cancel',
      confirmText: 'Confirm'
    }
    this.confirmService.open(data);
    this.confirmService.confirmed().subscribe(result => {
      if (result) {
        this.memberMessageService.deleteMessage(id).subscribe(() => {
          this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
        })
      }
    })

  }

  pageChanged(event: any): void {
    this.pageNumber = event.page;
    this.loadMessages();
  }

}

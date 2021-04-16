import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MemberMessageService, EventMessageService } from 'src/app/shared/services/';

@Component({
  selector: 'GU-event-chat',
  templateUrl: './event-chat.component.html',
  styleUrls: ['./event-chat.component.scss']
})
export class EventChatComponent {
  @ViewChild('chatForm') messageForm: NgForm;
  @Input() recipientId: string;
  @Input() type: string
  messageContent: string;

  constructor(
    public eventMessageService: EventMessageService,
    public memberMessageService: MemberMessageService
  ) { }

  sendMessage() {
    if (this.type === 'member') {
      this.memberMessageService.sendMessage(this.recipientId, this.messageContent).then(() => {
        this.messageForm.reset();
      });
    } else if (this.type === 'event') {
      this.eventMessageService.sendMessage(this.recipientId, this.messageContent).then(() => {
        this.messageForm.reset();
      });
    }

  }

}

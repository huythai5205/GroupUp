import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MemberMessageService, EventMessageService } from 'src/app/shared/services/';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'GU-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
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


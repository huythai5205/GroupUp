import { Component, Input } from '@angular/core';
import { Event } from 'src/app/shared/models';

@Component({
  selector: 'GU-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent {
  @Input() event: Event;
}

import { Component, Input, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'GU-event-table',
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class EventTableComponent implements OnInit {
  @Input() events: Event[];
  @Input() editDetail: string;

  eventsArray: Event[];
  displayedColumns: string[] = ['name', 'date', 'time', 'spots', 'edit'];
  expandedEvent: expandedColumns | null;

  constructor() { }

  ngOnInit(): void {
    this.eventsArray = Object.values(this.events);
  }
}

export interface expandedColumns {
  name: string;
  date: number;
  time: number;
  spots: string;
  description: string
}
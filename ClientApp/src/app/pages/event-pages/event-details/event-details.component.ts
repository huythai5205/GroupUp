import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Event, EventMessage, Member, User } from 'src/app/shared/models';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { AccountService, EventMessageService, EventService } from 'src/app/shared/services';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'GU-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})

export class EventDetailsComponent implements OnInit {

  user: User;
  event: Event;
  members: Member[] = [];
  messages: EventMessage[] = [];
  isParticipating: boolean = false;
  mapType = 'roadmap';


  constructor(
    private accountService: AccountService,
    private eventService: EventService,
    private eventMessageService: EventMessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadUser();
    this.loadEvent();
  }

  loadUser() {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user =>
      this.user = user);
  }

  loadEvent() {
    this.eventService.getEvent(this.route.snapshot.paramMap.get('eventId')).subscribe((event: Event) => {
      this.event = event;
      this.isParticipating = this.checkEventIfParticipating();
    }
    );
  }

  loadMembers(eventId: string) {
    this.eventService.getParticipants(eventId).subscribe(
      (members: Member[]) => {
        this.members = members;
      }
    );
  }

  addEvent() {
    const data = { userId: this.user.id, eventId: this.event.id };
    this.accountService.addEvent(data).subscribe(
      event => {
        this.isParticipating = true;
        this.user.eventsParticipating[event.id] = event;
        this.accountService.setCurrentUser(this.user);
      }
    );
  }

  checkEventIfParticipating(): boolean {
    if (this.user.eventsParticipating[this.event.id]
      || this.user.eventsCreated[this.event.id]) return true;
    return false;
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 2 && this.messages.length === 0) {
      console.log("in");
      this.eventMessageService.createHubConnection(this.user, this.event.id);
    } else {
      console.log('in');
      this.eventMessageService.stopHubConnection();
    }
  }

}


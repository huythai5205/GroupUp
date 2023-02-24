import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AccountService, EventService } from '../../../shared/services';
import { Event, Address, User } from '../../../shared/models';
import { timeCheck } from '../../../shared/validations';
import { take } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'GU-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss']
})

export class EventEditComponent implements OnInit {

  editEventForm: UntypedFormGroup;
  event: Event;
  formErrorMessage: string = '';
  todayDate: Date = new Date();
  location: Location;
  user: User;
  addressError: boolean = false;

  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private eventService: EventService,
    private accountService: AccountService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadUser();
    this.loadEvent();
    this.initializeForms();
  }

  loadUser(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });
  }

  loadEvent(): void {
    let eventId = this.route.snapshot.paramMap.get('eventId');
    if (eventId !== '0') {
      this.event = this.user.eventsCreated[eventId];
    }
  }

  initializeForms(): void {
    this.editEventForm = this.fb.group({
      id: this.event?.id || '',
      name: [this.event?.name || '', [Validators.required]],
      location: [this.event?.location || '', [Validators.required]],
      description: [this.event?.description || '', [Validators.required]],
      spotsAvailable: [this.event?.spotsAvailable || '', [Validators.required, Validators.min(3)]],
      dateOfEvent: [this.event?.dateOfEvent || '', [Validators.required]],
      startTime: [this.event?.startTime || '', Validators.required],
      endTime: [this.event?.endTime || '', [Validators.required, timeCheck('startTime')]],
      creatorEmail: this.user.email
    });
  }

  gotoDashBoard(): void {
    this.router.navigate(['/dashboard']);
  }

  getAddress(address: Address) {
    if (address) {
      this.addressError = false;
      this.editEventForm.controls['location'].setValue(address);
    } else {
      this.addressError = true;
    }
  }

  saveEvent(): void {
    this.eventService.save(this.editEventForm.value).subscribe(
      (event: Event) => {
        this.user.eventsCreated[event.id] = event;
        this.accountService.setCurrentUser(this.user);
        this.gotoDashBoard();
      });
  }

  deleteEvent(id): void {
    this.eventService.remove(id).subscribe(
      () => this.gotoDashBoard()
    );
  }

}

import { Component, OnInit } from '@angular/core';
import { Pagination } from 'src/app/shared/models';

import { EventService } from '../../../shared/services';
import { Event } from '../../../shared/models';
import { EventParams } from 'src/app/shared/models/event-params';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'GU-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})

export class EventListComponent implements OnInit {

  events: Event[];
  pagination: Pagination;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  userParams: EventParams;

  locationSearchForm: UntypedFormGroup;
  citySearchForm: UntypedFormGroup;
  orderByForm: UntypedFormGroup;

  isGeolocationError: boolean = false;

  states: string[];
  cities: string[];

  mapType = 'roadmap';

  markers = [];

  constructor(
    private eventService: EventService,
    private fb: UntypedFormBuilder
  ) {
    this.userParams = this.eventService.getUserParams();
  }

  ngOnInit() {
    this.initializeForms();
    this.loadEvents();
    this.getStates();
    this.citySearchForm.controls['state'].valueChanges.subscribe(
      () => this.getCities());
  }

  initializeForms() {
    this.locationSearchForm = this.fb.group({
      distanceWithin: ['', Validators.required]
    });

    this.citySearchForm = this.fb.group({
      state: ['', Validators.required],
      city: ['', Validators.required]
    });

    this.orderByForm = this.fb.group({
      orderBy: ['Created']
    });
  }

  loadEvents() {
    this.eventService.setUserParams(this.userParams);
    this.eventService.getEvents(this.userParams).subscribe(response => {
      this.events = response.result;
      this.pagination = response.pagination;
      this.addMarkers();
    });
  }

  resetFilters() {
    this.userParams = this.eventService.resetUserParams();
    this.loadEvents();
  }


  changePage(event: any) {
    this.userParams.pageSize = event.pageSize;
    this.userParams.pageNumber = event.pageIndex;
    this.loadEvents();
  }

  getStates() {
    this.eventService.getStates().subscribe(
      (result: any) => this.states = result.sort()
    );
  }

  // Get all the cities that have events
  getCities() {
    this.eventService.getCities(this.citySearchForm.controls['state'].value).subscribe(
      (result: any) => this.cities = result.sort()
    );
  }

  getEventsByCity() {
    this.userParams.setCity(
      this.citySearchForm.controls['city'].value,
      this.citySearchForm.controls['state'].value);
    this.loadEvents();
  }

  getEventsByLocation() {
    this.isGeolocationError = false;
    navigator.geolocation.watchPosition(position => {

      this.userParams.setLocation(
        this.locationSearchForm.controls['distanceWithin'].value,
        position.coords.longitude,
        position.coords.latitude);
      this.loadEvents();
    },
      error => {
        this.isGeolocationError = true;
      });
  }

  addMarkers() {
    this.markers = [];
    this.events.forEach((event: { location: { latitude: any; longitude: any; }; name: any; }) => {
      this.markers.push({
        lat: event.location.latitude,
        lng: event.location.longitude,
        label: event.name
      });
    });
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Event, PaginatedResult, EventParams } from '../models';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class EventService {

  eventParams: EventParams;
  eventsCache = new Map();

  constructor(
    private http: HttpClient
  ) {
    this.eventParams = new EventParams();
  }

  getUserParams = (): EventParams => this.eventParams;

  setUserParams = (params: EventParams): EventParams => this.eventParams = params;

  resetUserParams(): EventParams {
    this.eventParams = new EventParams();
    return this.eventParams;
  }

  getEvents(userParams: EventParams): Observable<PaginatedResult<Event[]>> {
    var events = this.eventsCache.get(Object.values(userParams).join('-'));
    if (events) {
      return of(events);
    }

    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('city', userParams.city);
    params = params.append('state', userParams.state);
    params = params.append('distanceWithin', userParams.distanceWithin.toString());
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedResult<Event[]>(environment.baseUrl + 'events', params)
      .pipe(map(events => {
        this.eventsCache.set(Object.values(userParams).join('-'), events);
        return events;
      }));
  }

  private getPaginatedResult<T>(url: string, params: HttpParams): Observable<PaginatedResult<T>> {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url, { observe: 'response', params })
      .pipe(map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      }));
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number): HttpParams {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return params;
  }

  getEvent(eventId: string): Observable<Event> {
    const event = [...this.eventsCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((event: Event) => event.id === eventId);

    if (event) {
      return of(event);
    }
    return this.http.get<Event>(environment.baseUrl + 'events/' + eventId);
  }

  getParticipants = (eventId: string): Observable<Object> => this.http.get(environment.baseUrl + 'events/getParticipants/' + eventId);

  getStates = (): Observable<string[]> => this.http.get<string[]>(environment.baseUrl + 'events/states');

  getCities = (state: string): Observable<string[]> => this.http.get<string[]>(environment.baseUrl + 'events/cities/' + state)

  save = (event: any): Observable<Event> => this.http.post<Event>(environment.baseUrl + 'events/save', event);

  remove = (eventId: number) => this.http.delete(`/${eventId}`);
}

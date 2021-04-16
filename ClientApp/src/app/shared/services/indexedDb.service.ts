import Dexie from 'dexie';

import { Injectable } from "@angular/core";

@Injectable()
export class IndexedDBService extends Dexie {

    private db: any;

    constructor() {
        super('IndexedDBService');
        this.openDB();
    }

    openDB(): void {
        this.db = new Dexie('GroupUpDB');
        this.db.version(1).stores({
            user: 'id, email, firstName, lastName, gender, DOB',
            eventsCreated: 'id , name, numParticipants, spotsAvailable, isRepeating, description, location, startDate, startTime, endTime',
            // tslint:disable-next-line:max-line-length
            eventsParticipating: 'id , name, numParticipants, spotsAvailable, isRepeating, description, location, startDate, startTime, endTime',
            repeatingDaysTimes: 'id, day, startTime, endTime, eventCreatedId, eventParticipatingId'
        });
    }

    addUser(user: any): void {
        this.openDB();
        this.db.user.put({
            token: user.token,
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
            DOB: user.DOB
        }).then(userId => {
            // user.eventsCreated.forEach(event => this.addEvent(event, eventCreated));
            // user.eventsParticipating.forEach(event => this.addEvent(event, eventParticipating));
        }).catch(e => console.log('Error: ' + (e.stack || e)));
    }

    addEvent(event: any, kindOfEvent: string) {
        this.db[kindOfEvent === 'eventCreated' ? 'eventsCreated' : 'eventsParticipating'].put({
            id: event.id,
            name: event.name,
            numParticipants: event.numParticipants,
            spotsAvailable: event.spotsAvailable,
            isRepeating: event.isRepeating,
            description: event.description,
            location: event.location,
            startDate: event.startDate,
            startTime: event.startTime,
            endTime: event.endTime
        }).then(eventId => {
            event.repeatingDaysTimes.forEach(r => {
                this.db.repeatingDaysTimes.add({
                    id: r.id,
                    day: r.day,
                    startTime: r.startTime,
                    endTime: r.endTime,
                    [kindOfEvent + 'Id']: eventId
                }).catch(e => console.log('Error: ' + (e.stack || e)));
            });
        }).catch(e => console.log('Error: ' + (e.stack || e)));

    }

    async getUserDataAsync() {
        const user = await this.db.user.toArray();
        if (user[0]) {
            user[0].eventsCreated = await this.db.eventsCreated.toArray();
            user[0].eventsCreated.forEach(event => {
                event.repeatingDaysTimes = this.db.repeatingDaysTimes.where({ eventCreatedId: event.id });
            });
            user[0].eventsParticipating = await this.db.eventsParticipating.toArray();
            user[0].eventsParticipating.forEach(event => {
                event.repeatingDaysTimes = this.db.repeatingDaysTimes.where({ eventParticipatingId: event.id });
            });
            return user[0];
        }
        return false;
    }

    async deleteDBAsync() {
        this.db.delete().then(() => this.db.open());
    }
}

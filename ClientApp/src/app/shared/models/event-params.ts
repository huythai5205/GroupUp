export class EventParams {

    city: string = null;
    state: string = null;
    distanceWithin: number = 0;
    pageNumber = 1;
    pageSize = 5;
    longitude: number = 0;
    latitude: number = 0;
    orderBy: string = 'Created';

    setCity(city: string, state: string) {
        this.city = city;
        this.state = state;
        this.distanceWithin = 0;
        this.longitude = 0;
        this.latitude = 0;
    }

    setLocation(distanceWithin: number, longitude: number, latitude: number) {
        this.distanceWithin = distanceWithin;
        this.longitude = longitude;
        this.latitude = latitude;
        this.city = null;
        this.state = null;
    }
}
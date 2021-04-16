
import { Component, ViewChild, EventEmitter, Output, AfterViewInit, Input } from '@angular/core';
import { Address } from './shared/models';

declare var google: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'GU-google-place',
  template: `
  <input class="input"
    type="text"
    #addressText style="border: 1px solid #ccc; width: 90%; height: 30px;"
    placeholder= "Please enter an address or establishment name."
    required >
`,
})

export class GooglePlacesComponent implements AfterViewInit {
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addressText', { static: true }) addressText: any;

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

  private getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.addressText.nativeElement,
      {
        componentRestrictions: { country: 'US' }
      });

    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.address_components) {
        this.setAddress.emit(this.getAddress(place));
      }
    });
  }

  private getAddress(place: any): Address {
    const fullAddressArray = place.formatted_address.split(',')
      .map((s: string) => s.trim());

    if (fullAddressArray.length === 4) {
      const countryZipArray = fullAddressArray[2].split(' ');
      const address = new Address();

      address.street = fullAddressArray[0];
      address.city = fullAddressArray[1];
      address.state = countryZipArray[0];
      address.zipCode = parseInt(countryZipArray[1]);

      address.country = fullAddressArray[3];

      address.longitude = place.geometry.location.lng();
      address.latitude = place.geometry.location.lat();
      return address;
    }
    return null;
  }
}

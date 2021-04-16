import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'GU-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() options: number[];

  constructor(
    @Self() public ngControl: NgControl
  ) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(value: number): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }

}

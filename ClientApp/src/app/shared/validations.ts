import { ValidatorFn, AbstractControl } from '@angular/forms';

export function timeCheck(toCheck: string) {
    return (control: AbstractControl) => {
        let timeArray = control?.value.split(':');
        let parentTimeArray = control?.parent?.controls[toCheck].value.split(':');
        let isTimeValid = false;
        if (timeArray?.length > 1 && parentTimeArray?.length > 1) {
            for (let i = 0; i < timeArray.length; i++) {
                if (timeArray[i] > parentTimeArray[i]) {
                    isTimeValid = true; { break; }
                }
            }
        }
        return isTimeValid ? null : { isTimeValid: true }
    }
}

export function matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
        return control?.value === control?.parent?.controls[matchTo].value
            ? null : { isMatching: true }
    }
}





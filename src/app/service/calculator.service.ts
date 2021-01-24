import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CONVERSIONS } from '../calculator/config';
import {
  GetConvertedValueRequest,
  GetConvertedValueResponse,
  GetFormResponse,
} from '../model';
import { roundToTenth } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  constructor(private api: AngularFireFunctions) {}

  evaluateConversion(
    startingValue: number,
    startingUnit: string,
    evaluateValue: number,
    convertedUnit: string
  ): Observable<any> {
    this.api.useFunctionsEmulator('http://localhost:5001');
    return this.api
      .httpsCallable<GetConvertedValueRequest, GetConvertedValueResponse>(
        'getConvertedValue'
      )({
        startingValue,
        startingUnit,
        convertedUnit,
      })
      .pipe(
        switchMap((response: GetConvertedValueResponse) => {
          let { convertedValue } = response;
          convertedValue = roundToTenth(convertedValue);
          evaluateValue = roundToTenth(evaluateValue);
          const isCorrect = convertedValue === evaluateValue;
          return of({ isCorrect, convertedValue });
        })
      );
  }

  getForm(): GetFormResponse {
    const conversionValueValidators = [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ];

    const startingValueControl = new FormControl(
      null,
      conversionValueValidators
    );
    const convertedValueControl = new FormControl(
      null,
      conversionValueValidators
    );
    const form = new FormGroup({
      conversionType: new FormControl(CONVERSIONS[0], Validators.required),
      startingValue: startingValueControl,
      startingUnit: new FormControl(
        CONVERSIONS[0].units[0],
        Validators.required
      ),
      convertedValue: convertedValueControl,
      convertedUnit: new FormControl(
        CONVERSIONS[0].units[1],
        Validators.required
      ),
    });
    return {
      form,
      startingValueControl,
      convertedValueControl,
    };
  }
}

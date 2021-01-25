import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { CONVERSIONS } from '../calculator/config';
import { GetConvertedValueResponse, GetFormResponse, Results } from '../model';
import { jsonDeepCopy, roundToTenth } from '../utils';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  constructor(private api: ApiService) {}

  evaluateConversion(
    startingValue: number,
    startingUnit: string,
    evaluateValue: number,
    convertedUnit: string
  ): Observable<any> {
    // this.api.useFunctionsEmulator('http://localhost:5001');
    return this.api
      .getConvertedValue({
        startingValue,
        startingUnit,
        convertedUnit,
      })
      .pipe<Results>(this.formatResults(evaluateValue));
  }

  handleError(error): Observable<any> {
    return of(error);
  }

  private formatResults(
    evaluateValue: number
  ): OperatorFunction<GetConvertedValueResponse, Results> {
    return switchMap(
      (response: GetConvertedValueResponse): Observable<Results> => {
        let { status, convertedValue } = response;
        if (status === 'success') {
          convertedValue = roundToTenth(convertedValue);
          evaluateValue = roundToTenth(evaluateValue);
          const isCorrect = convertedValue === evaluateValue;
          const payload: Results = { isCorrect, convertedValue };
          return of<Results>(payload);
        } else {
          return of({ error: true });
        }
      }
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
      conversionType: new FormControl(
        jsonDeepCopy(CONVERSIONS[0]),
        Validators.required
      ),
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

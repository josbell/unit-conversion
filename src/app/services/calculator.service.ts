import { Injectable } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable, of, OperatorFunction } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CONVERSIONS } from '../calculator/config';
import { GetConvertedValueResponse, GetFormResponse, Results } from '../model';
import { roundToTenth } from '../utils';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  constructor(private api: ApiService) {}

  /**
   * Calls coverter api to get actual conversion value
   * It then compares with value submitted by user
   * and returns whether user was correct or not along with actual value
   * @param startingValue Value that will be converted
   * @param startingUnit Unit that will be converted
   * @param evaluateValue Value to be evaluated
   * @param convertedUnit Unit that value will be converted to
   */
  evaluateConversion(
    startingValue: number,
    startingUnit: string,
    evaluateValue: number,
    convertedUnit: string
  ): Observable<any> {
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

  /**
   * Transforms response from unit converter api into data that can be consumed by template
   * @param evaluateValue Value to be compared with actual solution
   */
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

  /**
   * Initalizes Calculator Form
   */
  getForm(): GetFormResponse {
    const conversionValueValidators = this.getInputValidators(
      CONVERSIONS[0].allowNegative
    );

    // Initializing these separately to provide handle as output
    const startingValueControl = new FormControl(
      null,
      conversionValueValidators
    );
    const convertedValueControl = new FormControl(
      null,
      conversionValueValidators
    );
    const showAnswerControl = new FormControl(false);
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
      showAnswer: showAnswerControl,
    });
    return {
      form,
      startingValueControl,
      convertedValueControl,
      showAnswerControl,
    };
  }

  /**
   * Returns Validators for Numeric Inputs with option to
   * allow only positive numbers or negative as well
   * @param allowNegative Allows negative numbers
   */
  getInputValidators(allowNegative = true): ValidatorFn[] {
    const conversionValueValidators = [
      Validators.required,
      Validators.pattern('^[+]?([0-9]+(?:[.][0-9]*)?|.[0-9]+)$'),
    ];
    if (!allowNegative) {
      conversionValueValidators.push(Validators.min(0));
    }
    return conversionValueValidators;
  }
}

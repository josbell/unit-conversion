import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GetConvertedValueRequest, GetConvertedValueResponse } from '../model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private fireFunctions: AngularFireFunctions) {}

  /**
   * Calls API to fetch appropriate value in new unit
   * @param data Example: {startingValue: 1, startingUnitId: 'lb', convertedUnit: 'oz'}
   * In this example response would be {status: 'success', convertedUnit: 16}
   */
  getConvertedValue(
    data: GetConvertedValueRequest
  ): Observable<GetConvertedValueResponse> {
    return this.fireFunctions
      .httpsCallable<GetConvertedValueRequest, GetConvertedValueResponse>(
        'getConvertedValue'
      )(data)
      .pipe(catchError((_err) => of({ status: 'error' })));
  }
}

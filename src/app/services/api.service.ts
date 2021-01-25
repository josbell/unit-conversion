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

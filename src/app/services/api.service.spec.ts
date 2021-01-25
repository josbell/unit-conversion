import { AngularFireFunctions } from '@angular/fire/functions';
import { of, throwError } from 'rxjs';
import { GetConvertedValueRequest } from '../model';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let functions: jasmine.SpyObj<AngularFireFunctions>;

  beforeEach(() => {
    functions = jasmine.createSpyObj('functions', ['httpsCallable']);
    service = new ApiService(functions);
  });

  describe('getConvertedValue', () => {
    let inputData: GetConvertedValueRequest;

    beforeEach(() => {
      inputData = {
        startingValue: 300,
        startingUnit: 'K',
        convertedUnit: 'C',
      };
    });

    it('should return data', () => {
      const response = {
        status: 'success',
        convertedUnit: 40,
      };

      functions.httpsCallable.and.returnValue(() => of(response));
      service.getConvertedValue(inputData).subscribe((data) => {
        expect(data).toEqual(response);
      });
    });

    it('should handle observable error', () => {
      const response = {
        status: 'error',
      };

      functions.httpsCallable.and.returnValue(() => throwError(new Error()));
      service.getConvertedValue(inputData).subscribe((data) => {
        expect(data).toEqual(response);
      });
    });
  });
});

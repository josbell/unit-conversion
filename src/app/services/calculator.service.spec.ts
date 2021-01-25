import { of } from 'rxjs';
import { Results } from '../model';
import { ApiService } from './api.service';
import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  let service: CalculatorService;
  let api: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    api = jasmine.createSpyObj('api', ['getConvertedValue']);
    service = new CalculatorService(api as ApiService);
  });

  it('should be created', () => {
    expect(true).toBeTruthy();
  });

  describe('evaluateConversion', () => {
    const startingValue = 50;
    const startingUnit = 'F';
    const evaluateValue = 10;
    const convertedUnit = 'C';

    it('should return results', () => {
      const response = {
        status: 'success',
        convertedValue: 10,
      };
      api.getConvertedValue.and.returnValue(of(response));

      const expectedResults: Results = { isCorrect: true, convertedValue: 10 };
      service
        .evaluateConversion(
          startingValue,
          startingUnit,
          evaluateValue,
          convertedUnit
        )
        .subscribe((res) => {
          expect(res).toEqual(expectedResults);
        });
    });

    it('should handle observable errors gracefully and continue listening', () => {
      const response = {
        status: 'error',
      };
      api.getConvertedValue.and.returnValue(of(response));

      const expectedResults: Results = { error: true };
      service
        .evaluateConversion(
          startingValue,
          startingUnit,
          evaluateValue,
          convertedUnit
        )
        .subscribe((res) => {
          expect(res).toEqual(expectedResults);
        });
    });
  });
});

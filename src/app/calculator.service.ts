import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  constructor() {}

  evaluateConversion(
    startingValue: number,
    startingUnit: string,
    convertedValue: number,
    convertedUnit: string
  ) {}
}

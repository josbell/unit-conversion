import { FormControl, FormGroup } from '@angular/forms';

export interface GetConvertedValueResponse {
  status: 'success' | 'error';
  convertedValue?: number;
  error?: string;
}

export interface GetConvertedValueRequest {
  startingValue: number;
  startingUnit: string;
  convertedUnit: string;
}

export interface Results {
  isCorrect: boolean;
  convertedValue: number;
}

export interface GetFormResponse {
  form: FormGroup;
  startingValueControl: FormControl;
  convertedValueControl: FormControl;
}

export interface ConversionType {
  name: string;
  units: Unit[];
}

export interface Unit {
  name: string;
  id: string;
}

import { FormControl, FormGroup } from '@angular/forms';

export interface GetConvertedValueResponse {
  status: string;
  convertedValue?: number;
  error?: string;
}

export interface GetConvertedValueRequest {
  startingValue: number;
  startingUnit: string;
  convertedUnit: string;
}

export interface Results {
  isCorrect?: boolean;
  convertedValue?: number;
  error?: boolean;
}

export interface GetFormResponse {
  form: FormGroup;
  startingValueControl: FormControl;
  convertedValueControl: FormControl;
  showAnswerControl: FormControl;
}

export interface ConversionType {
  name: string;
  allowNegative: boolean;
  units: Unit[];
}

export interface Unit {
  name: string;
  id: string;
}

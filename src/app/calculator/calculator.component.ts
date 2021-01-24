import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Results, Unit } from '../model';
import { CalculatorService } from '../service/calculator.service';
import { isNumeric } from '../utils';
import { CONVERSIONS } from './config';
@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent implements OnInit {
  form: FormGroup;
  units: Unit[];
  results: Observable<Results>;
  showCorrectValue = false;
  conversions = CONVERSIONS;
  startingValueControl: FormControl;
  convertedValueControl: FormControl;

  constructor(private calculatorService: CalculatorService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.handleConversionTypeChange();
  }

  private initializeForm(): void {
    this.units = this.conversions[0].units;
    const {
      form,
      startingValueControl,
      convertedValueControl,
    } = this.calculatorService.getForm();
    this.form = form;
    this.startingValueControl = startingValueControl;
    this.convertedValueControl = convertedValueControl;
  }

  handleConversionTypeChange(): void {
    this.form.get('conversionType').valueChanges.subscribe((val) => {
      this.units = val.units;
      this.startingValueControl.setValue(null);
      this.form.get('startingUnit').setValue(this.units[0]);
      this.convertedValueControl.setValue(null);
      this.form.get('convertedUnit').setValue(this.units[1]);
    });
  }

  onSubmit(): void {
    const {
      startingValue,
      startingUnit: { id: startingUnitId },
      convertedValue,
      convertedUnit: { id: convertedUnitId },
    } = this.form.value;
    if (isNumeric(startingValue) && isNumeric(convertedValue)) {
      this.results = this.calculatorService.evaluateConversion(
        startingValue,
        startingUnitId,
        convertedValue,
        convertedUnitId
      );
    }
  }
}

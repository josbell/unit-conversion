import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConversionType, Results, Unit } from '../model';
import { CalculatorService } from '../services/calculator.service';
import { isNumeric, jsonDeepCopy } from '../utils';
import { CONVERSIONS } from './config';
@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent implements OnInit, OnDestroy {
  form: FormGroup;
  units: Unit[];
  results: Observable<Results>;
  showCorrectValue = false;
  readonly conversions: ConversionType[] = jsonDeepCopy(CONVERSIONS);
  startingValueControl: FormControl;
  convertedValueControl: FormControl;
  private unsubscribe = new Subject<void>();

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

  private handleConversionTypeChange(): void {
    this.form
      .get('conversionType')
      .valueChanges.pipe(takeUntil(this.unsubscribe))
      .subscribe((val: ConversionType) => {
        this.units = jsonDeepCopy(val.units);
        this.startingValueControl.setValue(null);
        this.form.get('startingUnit').setValue({ ...this.units[0] });
        this.convertedValueControl.setValue(null);
        this.form.get('convertedUnit').setValue({ ...this.units[1] });
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
      this.results.subscribe((val) => console.log(val));
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }
}

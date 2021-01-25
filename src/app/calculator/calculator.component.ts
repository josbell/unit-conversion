import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConversionType, Results, Unit } from '../model';
import { CalculatorService } from '../services/calculator.service';
import { isNumeric } from '../utils';
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
  readonly conversions: ConversionType[] = CONVERSIONS;
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

  matchByName(optionOne, optionTwo): boolean {
    return optionOne.name === optionTwo.name;
  }

  matchById(option1, option2): boolean {
    return option1.id === option2.id;
  }

  private handleConversionTypeChange(): void {
    this.form
      .get('conversionType')
      .valueChanges.pipe(takeUntil(this.unsubscribe))
      .subscribe((val: ConversionType) => {
        this.units = val.units;
        this.form.get('startingUnit').setValue({ ...this.units[0] });
        this.form.get('convertedUnit').setValue({ ...this.units[1] });

        const newValidators: ValidatorFn[] = this.calculatorService.getInputValidators(
          val.allowNegative
        );
        this.startingValueControl.reset();
        this.convertedValueControl.reset();
        this.startingValueControl.setValidators(newValidators);
        this.convertedValueControl.setValidators(newValidators);
      });
  }

  onSubmit(): void {
    const {
      startingValue,
      startingUnit: { id: startingUnitId },
      convertedValue,
      convertedUnit: { id: convertedUnitId },
    } = this.form.value;
    if (
      isNumeric(startingValue) &&
      isNumeric(convertedValue) &&
      this.form.valid
    ) {
      this.results = this.calculatorService.evaluateConversion(
        startingValue,
        startingUnitId,
        convertedValue,
        convertedUnitId
      );
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }
}

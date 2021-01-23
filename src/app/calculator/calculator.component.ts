import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalculatorService } from '../calculator.service';

enum Conversions {
  Temperature = 'TEMPERATURE',
  Volume = 'VOLUME',
}

enum TemperatureUnits {
  Kelvin = 'KELVIN',
  Celsious = 'CELSIOUS',
  Fahrenheit = 'FAHRENHEIT',
  Rankine = 'RANKINE',
}

enum VolumeUnits {
  Liters = 'LITERS',
  Tablespoons = 'TABLESPOONS',
  CubicInches = 'CUBIC_INCHES',
  Cups = 'CUPS',
  CubitFeet = 'CUBIC_FEET',
  Gallons = 'GALLONS',
}

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent implements OnInit {
  form: FormGroup;
  units: string[];
  isCorrect = false;

  conversions = [
    {
      name: 'Temperature',
      units: ['Kelvin', 'Celsious', 'Fahrenheit', 'Rankine'],
    },
    {
      name: 'Volume',
      units: [
        'Liters',
        'Tablespoons',
        'Cubic Inches',
        'Cups',
        'Cubic Feet',
        'Gallons',
      ],
    },
  ];
  constructor(
    private formBuilder: FormBuilder,
    private calculatorService: CalculatorService
  ) {}

  ngOnInit(): void {
    this.units = this.conversions[0].units;
    this.form = this.formBuilder.group({
      conversionType: [this.conversions[0]],
      startingValue: [null, Validators.required],
      startingUnit: [this.units[0], Validators.required],
      convertedValue: [null, Validators.required],
      convertedUnit: [this.units[1], Validators.required],
    });

    this.onChanges();
  }

  onChanges(): void {
    this.form.get('conversionType').valueChanges.subscribe((val) => {
      this.units = val.units;
      this.form.get('startingValue').setValue(null);
      this.form.get('startingUnit').setValue(this.units[0]);
      this.form.get('convertedValue').setValue(null);
      this.form.get('convertedUnit').setValue(this.units[1]);
      console.log(val);
    });
  }

  onTemperatureTypeChange(event): void {
    console.log(event);
  }

  onSubmit(): void {
    console.log(this.form.value);
    const {
      conversionType,
      startingValue,
      startingUnit,
      convertedValue,
      convertedUnit,
    } = this.form.value;
  }
}

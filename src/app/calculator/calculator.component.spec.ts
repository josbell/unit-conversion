import { CalculatorService } from '../services/calculator.service';
import { CalculatorComponent } from './calculator.component';
import { CONVERSIONS } from './config';
import { fakeAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { Results } from '../model';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let service: jasmine.SpyObj<CalculatorService>;

  beforeEach(() => {
    service = jasmine.createSpyObj('calculatorService', [
      'getForm',
      'evaluateConversion',
    ]);
    component = new CalculatorComponent((service as any) as CalculatorService);
  });

  beforeEach(() => {
    // Bind actual method implementation to fake service injected in component
    service.getForm.and.returnValue(new CalculatorService(null).getForm());
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form on ngInit', () => {
      const { form } = component;
      expect(component.units).toEqual(CONVERSIONS[0].units);
      expect(component.startingValueControl.value).toBe(null);
      expect(component.convertedValueControl.value).toBe(null);
      expect(form.get('conversionType').value).toEqual(CONVERSIONS[0]);
      expect(form.get('startingUnit').value).toEqual(CONVERSIONS[0].units[0]);
      expect(form.get('convertedUnit').value).toEqual(CONVERSIONS[0].units[1]);
      expect(component.form).toBeTruthy();
      expect(service.getForm).toHaveBeenCalled();
    });

    it('should setup subscription to reset form when conversionType dropdown changes', fakeAsync(() => {
      // Change initial state of form to make sure form is actually getting reset
      const { startingValueControl, convertedValueControl, form } = component;

      startingValueControl.setValue(4);
      convertedValueControl.setValue(5);

      // Changing conversionTypeControl value triggers form reset
      form.get('conversionType').setValue(CONVERSIONS[1], { emitEvent: true });

      expect(component.units).toEqual(CONVERSIONS[1].units);
      expect(startingValueControl.value).toBe(null);
      expect(convertedValueControl.value).toBe(null);
      expect(form.get('startingUnit').value).toEqual(CONVERSIONS[1].units[0]);
      expect(form.get('convertedUnit').value).toEqual(CONVERSIONS[1].units[1]);
    }));
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      // Bind actual method implementation to fake service injected in component
      service.getForm.and.returnValue(new CalculatorService(null).getForm());
      component.ngOnInit();
    });

    describe('Happy path', () => {
      it('should evaluate when onSubmit is called and input data is valid', () => {
        // Initialize form data
        component.startingValueControl.setValue(300);
        component.convertedValueControl.setValue(40);
        component.form
          .get('startingUnit')
          .setValue({ name: 'Kelvin', id: 'K' });
        component.form
          .get('convertedUnit')
          .setValue({ name: 'Celsious', id: 'C' });

        // Mock Api Response
        const response: Results = { isCorrect: false, convertedValue: 26.85 };
        service.evaluateConversion.and.returnValue(of(response));

        component.onSubmit();

        expect(service.evaluateConversion).toHaveBeenCalledWith(
          300,
          'K',
          40,
          'C'
        );

        component.results.subscribe((results) => {
          expect(results).toEqual(response);
        });
      });
    });

    describe('Form Validation', () => {
      const nonNumericValues = ['abc', ' ', 'e23', '#$%', null, [], {}];

      it('should not make api call if starting value is string', () => {
        for (const value of nonNumericValues) {
          component.startingValueControl.setValue(value);
          component.convertedValueControl.setValue(2);
          component.onSubmit();
          expect(service.evaluateConversion).not.toHaveBeenCalled();
        }
      });

      it('should not make api call if converted value is non numeric', () => {
        for (const value of nonNumericValues) {
          component.convertedValueControl.setValue(value);
          component.startingValueControl.setValue(4);
          component.onSubmit();
          expect(service.evaluateConversion).not.toHaveBeenCalled();
        }
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from form on component destroy to avoid memory leak', () => {
      // Set initial form data to make sure it does not reset on conversionType change
      component.startingValueControl.setValue(5);
      component.ngOnDestroy();
      component.form
        .get('conversionType')
        .setValue(CONVERSIONS[1], { emitEvent: true });
      expect(component.startingValueControl.value).toBe(5);
    });
  });
});

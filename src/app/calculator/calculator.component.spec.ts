import { CalculatorService } from '../service/calculator.service';
import { CalculatorComponent } from './calculator.component';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let service;

  beforeEach(() => {
    service = {
      getForm: jest.fn(),
      evaluateConversion: jest.fn(),
    };
    component = new CalculatorComponent((service as any) as CalculatorService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ConversionType } from '../model';

export const CONVERSIONS: ConversionType[] = [
  {
    name: 'Temperature',
    allowNegative: true,
    units: [
      { name: 'Kelvin', id: 'K' },
      { name: 'Celsious', id: 'C' },
      { name: 'Fahrenheit', id: 'F' },
      { name: 'Rankine', id: 'R' },
    ],
  },
  {
    name: 'Volume',
    allowNegative: false,
    units: [
      { name: 'Liters', id: 'l' },
      { name: 'Tablespoons', id: 'Tbs' },
      { name: 'Cubic Inches', id: 'in3' },
      { name: 'Cups', id: 'cup' },
      { name: 'Gallons', id: 'gal' },
      { name: 'Cubic Feet', id: 'ft3' },
    ],
  },
];

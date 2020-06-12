import { constrained } from './constraint';
import { number } from './primitive';

export const integer = constrained(number, Number.isInteger, 'integer');

export const positiveNumber = constrained(number, (x) => x >= 0, '>0');

export const positiveInteger = constrained(
  number,
  (x) => Number.isInteger(x) && x >= 0,
  'integer>=0'
);

export const nonZeroPositiveInteger = constrained(
  number,
  (x) => Number.isInteger(x) && x > 0,
  'integer>0'
);

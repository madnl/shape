import { constrained } from './constraint';
import { number } from './primitive';

/**
 * Integer numbers, as specified by Number.isInteger
 */
export const integer = constrained(number, Number.isInteger, { tag: 'integer' });

/**
 * Numbers which are greater or equal than zero
 */
export const positiveNumber = constrained(number, (x) => x >= 0, { tag: 'positiveNumber' });

/**
 * Integers which are greater or equal than zero
 */
export const positiveInteger = constrained(number, (x) => Number.isInteger(x) && x >= 0, {
  tag: 'positiveInteger',
});

/**
 * Integers which are strictly greater or equal than zero
 */
export const nonZeroPositiveInteger = constrained(number, (x) => Number.isInteger(x) && x > 0, {
  tag: 'nonZeroPositiveInteger',
});

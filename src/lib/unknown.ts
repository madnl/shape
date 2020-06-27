import { Shape, mismatch } from './core';

/**
 * Utility shape which will match any provided value and is
 * associated with the `unknown` type.
 */
export const unknown: Shape<unknown> = {
  verify(value: unknown) {
    return value;
  },

  toString() {
    return 'unknown';
  },
};

/**
 * Utility shape which will match any value as long as it's not null or undefined.
 * It is associated with the unknown type.
 */
export const something: Shape<NonNullable<unknown>> = {
  verify(value: unknown) {
    return value === null || value === undefined ? mismatch(something, value) : value;
  },

  toString() {
    return 'something';
  },
};

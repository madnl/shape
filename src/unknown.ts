import { Shape, mismatch } from './core';

export const unknown: Shape<unknown> = {
  verify(value: unknown) {
    return value;
  },

  toJSON() {
    return {
      type: 'unknown',
    };
  },

  toString() {
    return 'unknown';
  },
};

export const something: Shape<NonNullable<unknown>> = {
  verify(value: unknown) {
    return value === null || value === undefined ? mismatch(something, value) : value;
  },

  toJSON() {
    return {
      type: 'something',
    };
  },

  toString() {
    return 'something';
  },
};

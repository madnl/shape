import { Shape, mismatch } from './core';

export const unknown: Shape<unknown> = {
  check(value: unknown) {
    return value;
  },
};

export const something: Shape<NonNullable<unknown>> = {
  check(value: unknown) {
    return value === null || value === undefined ? mismatch(something, value) : value;
  },
};

import { Shape, mismatch } from './core';

export const unknown: Shape<unknown> = {
  verify(value: unknown) {
    return value;
  },
};

export const something: Shape<NonNullable<unknown>> = {
  verify(value: unknown) {
    return value === null || value === undefined ? mismatch(something, value) : value;
  },
};

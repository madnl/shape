import { Mismatch, Shape } from '../core';
import { unknown } from '../unknown';

export function matchedShape() {
  return {
    verify: jest.fn((value) => value),
    toString() {
      return 'mock';
    },
  };
}

export function mismatchedShape(mismatch: Mismatch) {
  return {
    verify: jest.fn(() => mismatch),
    toString() {
      return 'mock';
    },
  };
}

export function mismatch({
  path = ['foo'],
  shape = unknown,
  value = undefined,
}: { path?: string[]; shape?: Shape<unknown>; value?: unknown } = {}): Mismatch {
  return new Mismatch(path, shape, value);
}

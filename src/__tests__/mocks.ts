import { Mismatch, Shape } from '../lib/core';
import { unknown } from '../lib/unknown';

export function matchedShape() {
  return {
    verify: jest.fn((value) => value),
    toString() {
      return 'mock';
    },
  };
}

export function mismatchedShape(expectedMismatch: Mismatch = mismatch()) {
  return {
    verify: jest.fn(() => expectedMismatch),
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

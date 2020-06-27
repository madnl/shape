import { Shape, mismatch } from './core';
import { union } from './union';

export const undefinedValue: Shape<undefined> = {
  verify(value: unknown) {
    return value === undefined ? value : mismatch(undefinedValue, value);
  },

  toString() {
    return 'undefined';
  },
};

export const nullValue: Shape<null> = {
  verify(value: unknown) {
    return value === null ? value : mismatch(undefinedValue, value);
  },

  toString() {
    return 'null';
  },
};

export function nullish<T>(underlyingType: Shape<T>): Shape<T | null | undefined> {
  return union(underlyingType, nullValue, undefinedValue);
}

export function optional<T>(underlyingType: Shape<T>): Shape<T | undefined> {
  return union(underlyingType, undefinedValue);
}

export function nullable<T>(underlyingType: Shape<T>): Shape<T | null> {
  return union(underlyingType, nullValue);
}

import { Shape, mismatch } from './core';
import { union } from './union';

/**
 * Matches the `undefined` JS value.
 */
export const undefinedLiteral: Shape<undefined> = {
  verify(value: unknown) {
    return value === undefined ? value : mismatch(undefinedLiteral, value);
  },

  toString() {
    return 'undefined';
  },
};

/**
 * Matches the null value.
 */
export const nullLiteral: Shape<null> = {
  verify(value: unknown) {
    return value === null ? value : mismatch(nullLiteral, value);
  },

  toString() {
    return 'null';
  },
};

/**
 * Extends a shape to also accept null or undefined.
 * @param underlyingType The base shape
 * @returns a shape which matches the same values as the provided shape and also null or undefined
 */
export function nullish<T>(underlyingType: Shape<T>): Shape<T | null | undefined> {
  return union(underlyingType, nullLiteral, undefinedLiteral);
}

/**
 * Extends a shape to also accept undefined.
 * @param underlyingType The base shape
 * @returns a shape which matches the same values as the provided shape and also undefined
 */
export function optional<T>(underlyingType: Shape<T>): Shape<T | undefined> {
  return union(underlyingType, undefinedLiteral);
}

/**
 * Extends a shape to also accept null.
 * @param underlyingType The base shape
 * @returns a shape which matches the same values as the provided shape and also null
 */
export function nullable<T>(underlyingType: Shape<T>): Shape<T | null> {
  return union(underlyingType, nullLiteral);
}

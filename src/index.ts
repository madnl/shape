import { Shape } from './core';
import { union } from './union';
import { nullValue, undefinedValue } from './primitive';

export { Shape } from './core';

export function nullish<T>(underlyingType: Shape<T>): Shape<T | null | undefined> {
  return union(underlyingType, nullValue, undefinedValue);
}

export function optional<T>(underlyingType: Shape<T>): Shape<T | undefined> {
  return union(underlyingType, undefinedValue);
}

export function nullable<T>(underlyingType: Shape<T>): Shape<T | null> {
  return union(underlyingType, nullValue);
}

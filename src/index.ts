import { Shape } from './core';
import { union } from './union';
import { literal } from './literal';

export { Shape } from './core';
export { shape } from './shape';
export { array } from './array';
export { string, number, boolean } from './primitive';
export { union } from './union';
export { literal } from './literal';
export { tuple } from './tuple';
export { objectMap } from './objectMap';

export const undefinedValue: Shape<undefined> = literal(undefined);
export const nullValue: Shape<null> = literal(null);

export function nullish<T>(underlyingType: Shape<T>): Shape<T | null | undefined> {
  return union(underlyingType, nullValue, undefinedValue);
}

export function optional<T>(underlyingType: Shape<T>): Shape<T | undefined> {
  return union(underlyingType, undefinedValue);
}

export function nullable<T>(underlyingType: Shape<T>): Shape<T | null> {
  return union(underlyingType, nullValue);
}

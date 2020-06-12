import { Shape } from '.';
import { Mismatch, mismatch, isMismatch, nestedMismatch } from './core';

export function tuple<T1, T2>(shape1: Shape<T1>, shape2: Shape<T2>): Shape<[T1, T2]>;
export function tuple<T1, T2, T3>(
  shape1: Shape<T1>,
  shape2: Shape<T2>,
  shape3: Shape<T3>
): Shape<[T1, T2, T3]>;
export function tuple<T1, T2, T3, T4>(
  shape1: Shape<T1>,
  shape2: Shape<T2>,
  shape3: Shape<T3>,
  shape4: Shape<T4>
): Shape<[T1, T2, T3, T4]>;
export function tuple<T1, T2, T3, T4, T5>(
  shape1: Shape<T1>,
  shape2: Shape<T2>,
  shape3: Shape<T3>,
  shape4: Shape<T4>,
  shape5: Shape<T5>
): Shape<[T1, T2, T3, T4, T5]>;
export function tuple<T>(...itemTypes: Shape<T>[]): Shape<T[]> {
  return new Tuple(itemTypes);
}

class Tuple<T> implements Shape<T[]> {
  public readonly itemTypes: readonly Shape<T>[];

  constructor(itemTypes: readonly Shape<T>[]) {
    this.itemTypes = itemTypes;
  }

  check(value: unknown): T[] | Mismatch {
    if (!Array.isArray(value) || value.length !== this.itemTypes.length) {
      return mismatch(this, value);
    }
    for (let i = 0; i < this.itemTypes.length; i++) {
      const itemType = this.itemTypes[i];
      const item = value[i];
      const result = itemType.check(item);
      if (isMismatch(result)) {
        return nestedMismatch(`[${i}]`, result);
      }
    }
    return value;
  }
}

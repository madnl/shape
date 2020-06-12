import { Shape } from '.';
import { Mismatch, mismatch, isMismatch, nestedMismatch } from './core';

export function array<T>(itemType: Shape<T>): Shape<T[]> {
  return new ArrayShape(itemType);
}

class ArrayShape<T> implements Shape<T[]> {
  public readonly itemType: Shape<T>;

  constructor(itemType: Shape<T>) {
    this.itemType = itemType;
  }

  check(value: unknown): T[] | Mismatch {
    if (!Array.isArray(value)) {
      return mismatch({ value, shape: this });
    }
    for (let index = 0; index < value.length; index++) {
      const item = value[index];
      const result = this.itemType.check(item);
      if (isMismatch(result)) {
        return nestedMismatch(`[${index}]`, result);
      }
    }
    return value;
  }
}
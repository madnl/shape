import { Shape } from '.';
import { Mismatch, mismatch, isMismatch, nestedMismatch } from './core';

/**
 * Shape of an array where all items have the specified itemType
 * @param itemType The type of the items in the array
 */
export function array<T>(itemType: Shape<T>): Shape<T[]> {
  return new ArrayShape(itemType);
}

class ArrayShape<T> implements Shape<T[]> {
  public readonly itemType: Shape<T>;

  constructor(itemType: Shape<T>) {
    this.itemType = itemType;
  }

  verify(value: unknown): T[] | Mismatch {
    if (!Array.isArray(value)) {
      return mismatch(this, value);
    }
    for (let index = 0; index < value.length; index++) {
      const item = value[index];
      const result = this.itemType.verify(item);
      if (isMismatch(result)) {
        return nestedMismatch(`[${index}]`, result);
      }
    }
    return value;
  }

  toString(): string {
    return `Array<${this.itemType}>`;
  }
}

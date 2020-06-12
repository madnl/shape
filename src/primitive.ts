import { extendedTypeOf } from './util';
import { Shape, mismatch, Mismatch } from './core';

class PrimitiveShape<T> implements Shape<T> {
  public readonly typeId: string;

  constructor(typeId: 'string' | 'number' | 'boolean') {
    this.typeId = typeId;
  }

  check(value: unknown): T | Mismatch {
    return typeof value === this.typeId ? (value as T) : mismatch(this, value);
  }
}

export const string: Shape<string> = new PrimitiveShape('string');
export const number: Shape<number> = new PrimitiveShape('number');
export const boolean: Shape<boolean> = new PrimitiveShape('boolean');

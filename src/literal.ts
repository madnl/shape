import { Shape } from '.';
import { Mismatch, mismatch } from './core';

export function literal<T extends string | number | boolean | null | undefined>(
  literalValue: T
): Shape<T> {
  return new LiteralShape(literalValue);
}

class LiteralShape<T> implements Shape<T> {
  public readonly literalValue: T;

  constructor(literalValue: T) {
    this.literalValue = literalValue;
  }

  check(value: unknown): T | Mismatch {
    return value === this.literalValue ? (value as T) : mismatch(this, value);
  }
}

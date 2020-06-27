import { Shape } from '.';
import { Mismatch, mismatch } from './core';

/**
 * Creates a shape that matches only the exact primitive value provided.
 * @param literalValue The value to match. Only string, number or booleans are supported.
 */
export function literal<T extends string | number | boolean>(literalValue: T): Shape<T> {
  return new LiteralShape(literalValue);
}

class LiteralShape<T extends number | string | boolean> implements Shape<T> {
  public readonly value: T;

  constructor(literalValue: T) {
    this.value = literalValue;
  }

  verify(givenValue: unknown): T | Mismatch {
    return givenValue === this.value ? (givenValue as T) : mismatch(this, givenValue);
  }

  toString(): string {
    return JSON.stringify(this.value);
  }
}

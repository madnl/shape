import { Shape } from '.';
import { Mismatch, mismatch } from './core';

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

  toJSON() {
    return {
      type: 'literal',
      value: this.value,
    };
  }

  toString(): string {
    return JSON.stringify(this.value);
  }
}

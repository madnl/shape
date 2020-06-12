import { Shape } from '.';
import { Mismatch, isMismatch, mismatch } from './core';

export function and<T>(...shapes: readonly Shape<T>[]): Shape<T> {
  return new AndShape(shapes);
}

class AndShape<T> implements Shape<T> {
  public readonly shapes: readonly Shape<T>[];

  constructor(shapes: readonly Shape<T>[]) {
    this.shapes = shapes;
  }

  check(value: unknown): T | Mismatch {
    for (let i = 0; i < this.shapes.length; i++) {
      const shape = this.shapes[i];
      const result = shape.check(value);
      if (isMismatch(result)) {
        return mismatch(shape, value);
      }
    }
    return value as T;
  }
}

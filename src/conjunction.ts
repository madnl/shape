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

  verify(value: unknown): T | Mismatch {
    for (let i = 0; i < this.shapes.length; i++) {
      const shape = this.shapes[i];
      const result = shape.verify(value);
      if (isMismatch(result)) {
        return mismatch(shape, value);
      }
    }
    return value as T;
  }

  toJSON() {
    return {
      type: 'intersection',
      shapes: this.shapes,
    };
  }

  toString(): string {
    return this.shapes.map((shape) => shape.toString()).join(' & ');
  }
}

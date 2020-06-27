import { Shape } from '..';
import { Mismatch, isMismatch, mismatch } from './core';

/**
 * Compose a shape from the intersection of other shapes. This shape is
 * matched if all member shapes are satisfied.
 * @param {...Shape} shapes The shapes to be combined
 * @returns a Shape which matches when all intersected shapes match
 */
export function intersection<T1, T2>(shape1: Shape<T1>, shape2: Shape<T2>): Shape<T1 & T2>;
export function intersection<T1, T2, T3>(
  shape1: Shape<T1>,
  shape2: Shape<T2>,
  shape3: Shape<T3>
): Shape<T1 & T2 & T3>;
export function intersection<T1, T2, T3, T4>(
  shape1: Shape<T1>,
  shape2: Shape<T2>,
  shape3: Shape<T3>,
  shape4: Shape<T4>
): Shape<T1 & T2 & T3 & T4>;
export function intersection<T1, T2, T3, T4, T5>(
  shape1: Shape<T1>,
  shape2: Shape<T2>,
  shape3: Shape<T3>,
  shape4: Shape<T4>,
  shape5: Shape<T5>
): Shape<T1 & T2 & T3 & T4 & T5>;
export function intersection<T>(...shapes: readonly Shape<T>[]): Shape<T> {
  return new IntersectionShape(shapes);
}

class IntersectionShape<T> implements Shape<T> {
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

  toString(): string {
    return this.shapes.map((shape) => shape.toString()).join(' & ');
  }
}

import { Shape, isMatch, mismatch, Mismatch } from './core';

/**
 * Define a shape which, given the provided argument shapes, will match a value
 * if at least one argument shape matches the value and will mismatch if all
 * argument shapes fail to match the value
 * @param {...Shape} shapes The list of candidate shapes
 * @returns a shape that matches a value if any of the argument shapes matches the value
 */
export function union<T1, T2>(shape1: Shape<T1>, shape2: Shape<T2>): Shape<T1 | T2>;
export function union<T1, T2, T3>(
  shape1: Shape<T1>,
  shape2: Shape<T2>,
  shape3: Shape<T3>
): Shape<T1 | T2 | T3>;
export function union<T1, T2, T3, T4>(
  shape1: Shape<T1>,
  shape2: Shape<T2>,
  shape3: Shape<T3>,
  shape4: Shape<T4>
): Shape<T1 | T2 | T3 | T4>;
export function union<T1, T2, T3, T4, T5>(
  shape1: Shape<T1>,
  shape2: Shape<T2>,
  shape3: Shape<T3>,
  shape4: Shape<T4>,
  shape5: Shape<T5>
): Shape<T1 | T2 | T3 | T4 | T5>;
export function union<T>(...shapes: readonly Shape<T>[]): Shape<T> {
  return new UnionShape(shapes);
}

class UnionShape<T> implements Shape<T> {
  public readonly shapes: readonly Shape<T>[];

  constructor(shapes: readonly Shape<T>[]) {
    this.shapes = shapes;
  }

  verify(value: unknown): Mismatch | T {
    if (this.shapes.find((shape) => isMatch(shape, value))) {
      return value as T;
    } else {
      return mismatch(this, value);
    }
  }

  toString() {
    return this.shapes.join(' | ');
  }
}

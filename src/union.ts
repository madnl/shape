import { Shape, matches, mismatch } from './core';

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
  const unionShape: Shape<T> = {
    check(value: unknown) {
      if (shapes.find((shape) => matches(shape, value))) {
        return value as any;
      } else {
        return mismatch({ value, shape: unionShape });
      }
    },
  };
  return unionShape;
}

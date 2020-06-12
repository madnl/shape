import { extendedTypeOf } from './util';
import { Shape, mismatch } from './core';

export const string: Shape<string> = PrimitiveShape('string');
export const number: Shape<number> = PrimitiveShape('number');
export const boolean: Shape<boolean> = PrimitiveShape('boolean');
export const undefinedValue: Shape<undefined> = literal(undefined);
export const nullValue: Shape<null> = literal(null);

export function literal<T extends string | number | boolean | null | undefined>(
  literalValue: T
): Shape<T> {
  const literalShape: Shape<T> = {
    check(value: unknown) {
      return value === literalValue
        ? (value as any)
        : mismatch({
            value,
            shape: literalShape,
          });
    },
  };
  return literalShape;
}

function PrimitiveShape<T>(expectedTypeId: string): Shape<T> {
  const primitiveShape = {
    check(value: unknown) {
      return typeof value === expectedTypeId
        ? (value as any)
        : mismatch({
            value,
            shape: primitiveShape,
          });
    },
  };
  return primitiveShape;
}

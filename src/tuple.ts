import { Shape } from '.';
import { Mismatch, mismatch, isMismatch, nestedMismatch, Static } from './core';

type TupleOfShapes = readonly Shape<unknown>[];

type TypeFromShapeTuple<ArrayT> = {
  [K in keyof ArrayT]: ArrayT[K] extends Shape<infer U> ? U : never;
};

/**
 * Shape that matches array which have a fixed length and where the items
 * match the corresponding shapes passed ar arguments.
 *
 * @param itemTypes The types of the items. The items are matched positionally
 * @returns An array shape with a fixed length and where individual items match the corresponding shapes
 */
export function tuple<ArrayT extends TupleOfShapes>(
  ...itemTypes: ArrayT
): Shape<TypeFromShapeTuple<ArrayT>> {
  return new TupleShape(itemTypes);
}

class TupleShape<ArrayT extends TupleOfShapes> implements Shape<TypeFromShapeTuple<ArrayT>> {
  public readonly itemTypes: ArrayT;

  constructor(itemTypes: ArrayT) {
    this.itemTypes = itemTypes;
  }

  verify(value: unknown): TypeFromShapeTuple<ArrayT> | Mismatch {
    if (!Array.isArray(value) || value.length !== this.itemTypes.length) {
      return mismatch(this, value);
    }
    for (let i = 0; i < this.itemTypes.length; i++) {
      const itemType = this.itemTypes[i];
      const item = value[i];
      const result = itemType.verify(item);
      if (isMismatch(result)) {
        return nestedMismatch(`[${i}]`, result);
      }
    }
    return (value as unknown) as TypeFromShapeTuple<ArrayT>;
  }

  toString() {
    return `[${this.itemTypes.join(', ')}]`;
  }
}
